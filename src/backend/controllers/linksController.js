import { query } from '../db/index.js';
import { resolveAmazonProduct } from '../utils/amazon.js';
import { realtimeHub } from '../utils/realtime.js';
export async function getAllLinks(req, res) {
    try {
        const { username, country, search } = req.query;
        let sql = `
      SELECT l.*, u.name as partner_name, u.email as partner_email
      FROM affiliate_links l
      JOIN users u ON l.user_id = u.id
      WHERE l.status != 'revoked'
    `;
        const params = [];
        // Filter by username / store slug if viewing public store
        if (username) {
            params.push(String(username).toLowerCase());
            sql += ` AND (LOWER(u.store_slug) = $${params.length} OR LOWER(u.id) = $${params.length})`;
        }
        else if (req.user) {
            params.push(req.user.id);
            sql += ` AND l.user_id = $${params.length}`;
        }
        else {
            return res.json({ success: true, links: [] });
        }
        if (country && country !== 'All countries') {
            params.push(`%${country}%`);
            sql += ` AND l.country ILIKE $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND (l.name ILIKE $${params.length} OR l.asin ILIKE $${params.length} OR l.short_slug ILIKE $${params.length})`;
        }
        sql += ` ORDER BY l.created_at DESC`;
        const result = await query(sql, params);
        // Map to camelCase response matching frontend interface
        const links = result.rows.map((row) => ({
            id: row.id,
            partnerId: row.user_id,
            partnerName: row.partner_name,
            partnerEmail: row.partner_email,
            name: row.name,
            destinationUrl: row.destination_url,
            affiliateUrl: row.affiliate_url,
            shortSlug: row.short_slug,
            shortUrl: row.short_url,
            showcaseUrl: row.showcase_url,
            country: row.country,
            views: row.views,
            clicks: row.clicks,
            rating: row.rating,
            price: row.price,
            originalPrice: row.original_price,
            imageUrl: row.image_url,
            asin: row.asin,
            features: row.features,
            status: row.status,
            createdAt: new Date(row.created_at).toLocaleDateString('en-US'),
        }));
        // Also get active user info for dashboard header
        const defaultUserId = req.user ? req.user.id : 'usr_ahmar';
        const userRes = await query(`SELECT id, name, email, phone, commission_rate, currently_owed, lifetime_earnings, total_paid_out
       FROM users WHERE id = $1`, [defaultUserId]);
        const user = userRes.rows.length > 0 ? {
            id: userRes.rows[0].id,
            name: userRes.rows[0].name,
            email: userRes.rows[0].email,
            phone: userRes.rows[0].phone,
            commissionRate: parseFloat(userRes.rows[0].commission_rate),
            currentlyOwed: parseFloat(userRes.rows[0].currently_owed),
            lifetimeEarnings: parseFloat(userRes.rows[0].lifetime_earnings),
            totalPaidOut: parseFloat(userRes.rows[0].total_paid_out),
        } : null;
        return res.json({ success: true, links, user });
    }
    catch (err) {
        console.error('getAllLinks error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getLinkBySlug(req, res) {
    try {
        const { slug } = req.params;
        const result = await query(`SELECT l.*, u.name as partner_name, u.store_slug
       FROM affiliate_links l
       JOIN users u ON l.user_id = u.id
       WHERE LOWER(l.short_slug) = LOWER($1) OR LOWER(l.asin) = LOWER($1)`, [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Product link not found' });
        }
        const row = result.rows[0];
        query('UPDATE affiliate_links SET views = views + 1 WHERE id = $1', [row.id]).catch(console.error);
        const link = {
            id: row.id,
            partnerId: row.user_id,
            partnerName: row.partner_name,
            name: row.name,
            destinationUrl: row.destination_url,
            affiliateUrl: row.affiliate_url,
            shortSlug: row.short_slug,
            shortUrl: row.short_url,
            showcaseUrl: row.showcase_url,
            country: row.country,
            views: row.views,
            clicks: row.clicks,
            rating: row.rating,
            price: row.price,
            originalPrice: row.original_price,
            imageUrl: row.image_url,
            asin: row.asin,
            features: row.features,
            status: row.status,
            createdAt: new Date(row.created_at).toLocaleDateString('en-US'),
        };
        return res.json({ success: true, link });
    }
    catch (err) {
        console.error('getLinkBySlug error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function createAffiliateLinkInternal(params) {
    const { destinationUrl, userId, name, customSlug, country } = params;
    if (!destinationUrl) {
        throw new Error('Destination URL is required');
    }
    const productInfo = await resolveAmazonProduct(destinationUrl);
    // Generate unique slug
    let rawSlug = customSlug || productInfo.asin.toLowerCase();
    rawSlug = rawSlug.replace(/[^a-z0-9-]/g, '-').slice(0, 30);
    if (!rawSlug)
        rawSlug = `link-${Date.now()}`;
    let slug = rawSlug;
    let counter = 1;
    // Check collision in PostgreSQL
    while (true) {
        const check = await query('SELECT id FROM affiliate_links WHERE short_slug = $1', [slug]);
        if (check.rows.length === 0)
            break;
        slug = `${rawSlug}-${counter}`;
        counter++;
    }
    const linkId = `lnk-${Date.now()}`;
    const linkName = name || productInfo.title;
    const finalCountry = country || productInfo.country;
    const shortUrl = `/r/${slug}`;
    const showcaseUrl = `/p/${slug}`;
    // Inject Amazon subtag tracking for independent partner attribution: ascsubtag=<userId>__<linkId>
    let trackedAffiliateUrl = productInfo.affiliateUrl;
    try {
        const u = new URL(trackedAffiliateUrl);
        u.searchParams.set('ascsubtag', `${userId}__${linkId}`);
        trackedAffiliateUrl = u.toString();
    }
    catch {
        const sep = trackedAffiliateUrl.includes('?') ? '&' : '?';
        trackedAffiliateUrl = `${trackedAffiliateUrl}${sep}ascsubtag=${userId}__${linkId}`;
    }
    const insertResult = await query(`INSERT INTO affiliate_links (
      id, user_id, name, destination_url, affiliate_url, short_slug,
      short_url, showcase_url, country, views, clicks, rating,
      price, original_price, image_url, asin, features, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, 0, $10, $11, $12, $13, $14, $15, 'active')
    RETURNING *`, [
        linkId,
        userId,
        linkName,
        destinationUrl,
        trackedAffiliateUrl,
        slug,
        shortUrl,
        showcaseUrl,
        finalCountry,
        productInfo.rating,
        productInfo.price,
        productInfo.originalPrice,
        productInfo.imageUrl,
        productInfo.asin,
        JSON.stringify(productInfo.features),
    ]);
    const row = insertResult.rows[0];
    const newLink = {
        id: row.id,
        partnerId: row.user_id,
        name: row.name,
        destinationUrl: row.destination_url,
        affiliateUrl: row.affiliate_url,
        shortSlug: row.short_slug,
        shortUrl: row.short_url,
        showcaseUrl: row.showcase_url,
        country: row.country,
        views: row.views,
        clicks: row.clicks,
        rating: row.rating,
        price: row.price,
        originalPrice: row.original_price,
        imageUrl: row.image_url,
        asin: row.asin,
        features: row.features,
        status: row.status,
        createdAt: new Date(row.created_at).toLocaleDateString('en-US'),
    };
    // Emit real-time event to connected SSE clients
    realtimeHub.broadcast({ type: 'LINK_CREATED', link: newLink });
    return newLink;
}
export async function createLink(req, res) {
    try {
        const { destinationUrl, name, customSlug, country } = req.body;
        if (!destinationUrl) {
            return res.status(400).json({ success: false, error: 'Destination URL is required' });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required to create links' });
        }
        const newLink = await createAffiliateLinkInternal({
            destinationUrl,
            userId,
            name,
            customSlug,
            country,
        });
        return res.status(201).json({ success: true, link: newLink });
    }
    catch (err) {
        console.error('createLink error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function revokeLink(req, res) {
    try {
        const id = req.query.id || req.body?.id || req.params.id;
        const slug = req.query.slug || req.body?.slug || req.params.slug;
        if (!id && !slug) {
            return res.status(400).json({ success: false, error: 'Link ID or Slug is required' });
        }
        let deleteSql = `DELETE FROM affiliate_links WHERE 1=1`;
        const params = [];
        if (id) {
            params.push(id);
            deleteSql += ` AND id = $${params.length}`;
        } else if (slug) {
            params.push(String(slug).toLowerCase());
            deleteSql += ` AND LOWER(short_slug) = $${params.length}`;
        }
        if (req.user && req.user.role !== 'admin') {
            params.push(req.user.id);
            deleteSql += ` AND user_id = $${params.length}`;
        }
        deleteSql += ` RETURNING id, short_slug, name`;
        const result = await query(deleteSql, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Link not found or unauthorized' });
        }
        const removedLink = result.rows[0];
        realtimeHub.broadcast({
            type: 'LINK_REVOKED',
            id: removedLink.id,
            slug: removedLink.short_slug,
        });
        return res.json({
            success: true,
            message: 'Link removed successfully',
            link: removedLink,
        });
    }
    catch (err) {
        console.error('revokeLink error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function handleRedirect(req, res) {
    try {
        const { slug } = req.params;
        const result = await query(`SELECT * FROM affiliate_links WHERE LOWER(short_slug) = LOWER($1)`, [slug]);
        if (result.rows.length === 0 || result.rows[0].status === 'revoked') {
            const redirectBase = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${redirectBase}/dashboard`);
        }
        const link = result.rows[0];
        // Atomically increment views and clicks in PostgreSQL
        await query(`UPDATE affiliate_links SET clicks = clicks + 1, views = views + 1, updated_at = NOW() WHERE id = $1`, [link.id]);
        // Record click log
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        const referrer = req.headers['referer'] || '';
        await query(`INSERT INTO link_clicks (link_id, user_id, short_slug, ip_address, user_agent, referrer, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [link.id, link.user_id, link.short_slug, String(ip).slice(0, 50), String(userAgent), String(referrer), link.country]);
        // Broadcast real-time SSE event for click and view counters
        realtimeHub.broadcast({
            type: 'CLICK_REGISTERED',
            slug: link.short_slug,
            link: { ...link, clicks: link.clicks + 1, views: link.views + 1 },
        });
        let targetUrl = link.affiliate_url || link.destination_url || 'https://www.amazon.com';
        try {
            const parsedUrl = new URL(targetUrl);
            if (!parsedUrl.searchParams.has('ascsubtag')) {
                parsedUrl.searchParams.set('ascsubtag', `${link.user_id}__${link.id}`);
                targetUrl = parsedUrl.toString();
            }
        }
        catch {
            if (!targetUrl.includes('ascsubtag=')) {
                const separator = targetUrl.includes('?') ? '&' : '?';
                targetUrl = `${targetUrl}${separator}ascsubtag=${link.user_id}__${link.id}`;
            }
        }
        return res.redirect(targetUrl);
    }
    catch (err) {
        console.error('handleRedirect error:', err);
        const redirectBase = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${redirectBase}/dashboard`);
    }
}
export async function previewProductInfo(req, res) {
    try {
        const url = (req.body?.url || req.query?.url);
        if (!url) {
            return res.status(400).json({ success: false, error: 'Amazon URL or ASIN is required' });
        }
        const product = await resolveAmazonProduct(url);
        return res.json({ success: true, product });
    }
    catch (err) {
        console.error('previewProductInfo error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
