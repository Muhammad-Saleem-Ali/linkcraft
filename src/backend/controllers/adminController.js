import { query } from '../db/index.js';
import { realtimeHub } from '../utils/realtime.js';
export async function getAdminOverview(req, res) {
    try {
        // 1. User metrics
        const userStats = await query(`
      SELECT
        COUNT(*)::int as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END)::int as active_users,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int as pending_users,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END)::int as suspended_users,
        COALESCE(SUM(currently_owed), 0)::numeric as total_currently_owed,
        COALESCE(SUM(lifetime_earnings), 0)::numeric as total_lifetime_earnings,
        COALESCE(SUM(total_paid_out), 0)::numeric as total_paid_out
      FROM users WHERE role != 'admin'
    `);
        // 2. Links metrics
        const linkStats = await query(`
      SELECT
        COUNT(*)::int as total_links,
        COALESCE(SUM(views), 0)::int as total_views,
        COALESCE(SUM(clicks), 0)::int as total_clicks
      FROM affiliate_links
    `);
        // 3. Payouts metrics
        const payoutStats = await query(`
      SELECT
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int as pending_payouts_count,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0)::numeric as pending_payouts_amount
      FROM payouts
    `);
        // 4. Top performing partners
        const topPartners = await query(`
      SELECT
        u.id, u.name, u.email, u.status, u.commission_rate,
        u.currently_owed, u.lifetime_earnings,
        COUNT(l.id)::int as links_count,
        COALESCE(SUM(l.clicks), 0)::int as clicks_count
      FROM users u
      LEFT JOIN affiliate_links l ON u.id = l.user_id AND l.status != 'revoked'
      WHERE u.role != 'admin'
      GROUP BY u.id
      ORDER BY clicks_count DESC, u.lifetime_earnings DESC
      LIMIT 5
    `);
        const u = userStats.rows[0];
        const l = linkStats.rows[0];
        const p = payoutStats.rows[0];
        const conversionRate = l.total_views > 0
            ? ((l.total_clicks / l.total_views) * 100).toFixed(1) + '%'
            : '0.0%';
        return res.json({
            success: true,
            metrics: {
                totalAffiliates: u.total_users,
                activeAffiliates: u.active_users,
                pendingAffiliates: u.pending_users,
                suspendedAffiliates: u.suspended_users,
                totalLinks: l.total_links,
                totalViews: l.total_views,
                totalClicks: l.total_clicks,
                conversionRate,
                totalCurrentlyOwed: parseFloat(u.total_currently_owed),
                totalLifetimeEarnings: parseFloat(u.total_lifetime_earnings),
                totalPaidOut: parseFloat(u.total_paid_out),
                pendingPayoutsCount: p.pending_payouts_count,
                pendingPayoutsAmount: parseFloat(p.pending_payouts_amount),
                amazonPartnerTag: process.env.AMAZON_PARTNER_TAG || 'linkcraft-20',
            },
            topPartners: topPartners.rows.map(r => ({
                id: r.id,
                name: r.name,
                email: r.email,
                status: r.status,
                commissionRate: parseFloat(r.commission_rate),
                currentlyOwed: parseFloat(r.currently_owed),
                lifetimeEarnings: parseFloat(r.lifetime_earnings),
                linksCount: r.links_count,
                clicksCount: r.clicks_count,
            })),
        });
    }
    catch (err) {
        console.error('getAdminOverview error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getAllUsers(req, res) {
    try {
        const { status, search } = req.query;
        let sql = `
      SELECT
        u.id, u.name, u.email, u.phone, u.role, u.status,
        u.commission_rate, u.currently_owed, u.lifetime_earnings, u.total_paid_out,
        u.bank_name, u.account_title, u.iban, u.store_slug, u.is_page_live,
        u.created_at,
        COUNT(l.id)::int as links_count,
        COALESCE(SUM(l.clicks), 0)::int as clicks_count
      FROM users u
      LEFT JOIN affiliate_links l ON u.id = l.user_id AND l.status != 'revoked'
      WHERE u.role != 'admin'
    `;
        const params = [];
        if (status && status !== 'all') {
            params.push(status);
            sql += ` AND u.status = $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.store_slug ILIKE $${params.length})`;
        }
        sql += ` GROUP BY u.id ORDER BY u.created_at DESC`;
        const result = await query(sql, params);
        const users = result.rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            role: r.role,
            status: r.status,
            commissionRate: parseFloat(r.commission_rate),
            currentlyOwed: parseFloat(r.currently_owed),
            lifetimeEarnings: parseFloat(r.lifetime_earnings),
            totalPaidOut: parseFloat(r.total_paid_out),
            bankName: r.bank_name,
            accountTitle: r.account_title,
            iban: r.iban,
            storeSlug: r.store_slug,
            isPageLive: r.is_page_live,
            linksCount: r.links_count,
            clicksCount: r.clicks_count,
            createdAt: new Date(r.created_at).toLocaleDateString('en-US'),
        }));
        return res.json({ success: true, count: users.length, users });
    }
    catch (err) {
        console.error('getAllUsers error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updateUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['active', 'pending', 'suspended'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Status must be one of: active, pending, suspended' });
        }
        const result = await query(`UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, status`, [status, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        return res.json({
            success: true,
            message: `User status updated to ${status}`,
            user: result.rows[0],
        });
    }
    catch (err) {
        console.error('updateUserStatus error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updateUserCommission(req, res) {
    try {
        const { id } = req.params;
        const { commissionRate } = req.body;
        const rate = parseFloat(commissionRate);
        if (isNaN(rate) || rate < 0 || rate > 1) {
            return res.status(400).json({ success: false, error: 'Commission rate must be a valid number between 0.00 and 1.00' });
        }
        const result = await query(`UPDATE users SET commission_rate = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, commission_rate`, [rate, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        return res.json({
            success: true,
            message: `Commission rate updated to ${(rate * 100).toFixed(0)}%`,
            user: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
                commissionRate: parseFloat(result.rows[0].commission_rate),
            },
        });
    }
    catch (err) {
        console.error('updateUserCommission error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getPlatformReports(req, res) {
    try {
        // 1. Monthly Performance
        const monthlyReports = await query(`
      SELECT
        month,
        COUNT(*)::int as total_records,
        SUM(ordered_count)::int as total_ordered,
        SUM(shipped_count)::int as total_shipped,
        SUM(returned_count)::int as total_returned,
        SUM(revenue_amount)::numeric as total_revenue,
        SUM(commission_amount)::numeric as total_commission
      FROM earnings_reports
      GROUP BY month
      ORDER BY month DESC
    `);
        // 2. Country Breakdown
        const countryBreakdown = await query(`
      SELECT
        country,
        COUNT(*)::int as orders_count,
        SUM(revenue_amount)::numeric as revenue,
        SUM(commission_amount)::numeric as commission
      FROM earnings_reports
      GROUP BY country
      ORDER BY revenue DESC
    `);
        // 3. Top affiliate revenue drivers
        const topAffiliates = await query(`
      SELECT
        u.id, u.name, u.email,
        COUNT(e.id)::int as items_sold,
        COALESCE(SUM(e.revenue_amount), 0)::numeric as revenue_generated,
        COALESCE(SUM(e.commission_amount), 0)::numeric as commission_earned
      FROM users u
      JOIN earnings_reports e ON u.id = e.user_id
      GROUP BY u.id
      ORDER BY revenue_generated DESC
      LIMIT 10
    `);
        return res.json({
            success: true,
            monthly: monthlyReports.rows.map(r => ({
                month: r.month,
                totalOrdered: r.total_ordered,
                totalShipped: r.total_shipped,
                totalReturned: r.total_returned,
                totalRevenue: parseFloat(r.total_revenue),
                totalCommission: parseFloat(r.total_commission),
            })),
            byCountry: countryBreakdown.rows.map(r => ({
                country: r.country,
                ordersCount: r.orders_count,
                revenue: parseFloat(r.revenue),
                commission: parseFloat(r.commission),
            })),
            topAffiliates: topAffiliates.rows.map(r => ({
                id: r.id,
                name: r.name,
                email: r.email,
                itemsSold: r.items_sold,
                revenueGenerated: parseFloat(r.revenue_generated),
                commissionEarned: parseFloat(r.commission_earned),
            })),
        });
    }
    catch (err) {
        console.error('getPlatformReports error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getAllPayouts(req, res) {
    try {
        const { status } = req.query;
        let sql = `
      SELECT p.*, u.name as partner_name, u.email as partner_email, u.bank_name, u.account_title, u.iban
      FROM payouts p
      JOIN users u ON p.user_id = u.id
    `;
        const params = [];
        if (status && status !== 'all') {
            params.push(status);
            sql += ` WHERE p.status = $1`;
        }
        sql += ` ORDER BY p.created_at DESC`;
        const result = await query(sql, params);
        return res.json({
            success: true,
            count: result.rows.length,
            payouts: result.rows.map(r => ({
                id: r.id,
                payoutTag: r.payout_tag,
                userId: r.user_id,
                partnerName: r.partner_name,
                partnerEmail: r.partner_email,
                bankName: r.bank_name,
                accountTitle: r.account_title,
                iban: r.iban,
                amount: parseFloat(r.amount),
                status: r.status,
                monthCovered: r.month_covered,
                countries: r.countries,
                paymentMethod: r.payment_method,
                receiptTitle: r.receipt_title,
                paidAt: r.paid_at,
                createdAt: r.created_at,
            })),
        });
    }
    catch (err) {
        console.error('getAllPayouts error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function processPayout(req, res) {
    try {
        const { id } = req.params;
        const { receiptTitle } = req.body;
        const client = await query('SELECT * FROM payouts WHERE id = $1', [id]);
        if (client.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Payout record not found' });
        }
        const payout = client.rows[0];
        if (payout.status === 'paid') {
            return res.status(400).json({ success: false, error: 'This payout has already been marked as paid' });
        }
        const payoutAmount = parseFloat(payout.amount);
        // Update payout status to paid
        await query(`UPDATE payouts
       SET status = 'paid', paid_at = NOW(), receipt_title = $1
       WHERE id = $2`, [receiptTitle || `Payout receipt — ${payout.month_covered}`, id]);
        // Deduct from user currently_owed, add to total_paid_out
        await query(`UPDATE users
       SET currently_owed = GREATEST(0, currently_owed - $1),
           total_paid_out = total_paid_out + $1,
           updated_at = NOW()
       WHERE id = $2`, [payoutAmount, payout.user_id]);
        realtimeHub.broadcast({
            type: 'PAYOUT_PROCESSED',
            payoutId: id,
            userId: payout.user_id,
            amount: payoutAmount,
        });
        return res.json({
            success: true,
            message: `Payout of Rs. ${payoutAmount.toLocaleString()} marked as paid successfully`,
        });
    }
    catch (err) {
        console.error('processPayout error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getAllLinks(req, res) {
    try {
        const { search, country, status } = req.query;
        let sql = `
      SELECT l.*, u.name as partner_name, u.email as partner_email
      FROM affiliate_links l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
        const params = [];
        if (status && status !== 'all') {
            params.push(status);
            sql += ` AND l.status = $${params.length}`;
        }
        if (country && country !== 'All countries') {
            params.push(`%${country}%`);
            sql += ` AND l.country ILIKE $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND (l.name ILIKE $${params.length} OR l.asin ILIKE $${params.length} OR u.name ILIKE $${params.length})`;
        }
        sql += ` ORDER BY l.created_at DESC`;
        const result = await query(sql, params);
        return res.json({
            success: true,
            count: result.rows.length,
            links: result.rows.map(row => ({
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
                status: row.status,
                createdAt: new Date(row.created_at).toLocaleDateString('en-US'),
            })),
        });
    }
    catch (err) {
        console.error('admin getAllLinks error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
/**
 * Attributed Order Ingestion:
 * Processes Amazon orders & earnings, matching ascsubtag (<userId>__<linkId>)
 * and crediting the correct partner's commission balance independently.
 */
export async function importAmazonOrders(req, res) {
    try {
        const { orders, month } = req.body;
        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ success: false, error: 'orders array is required' });
        }
        const currentMonth = month || new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });
        let attributedCount = 0;
        let unattributedCount = 0;
        const processedResults = [];
        for (const order of orders) {
            // Expected order structure: { asin, productName, revenue, commission, ascsubtag, country }
            const subtag = (order.ascsubtag || order.subtag || '').trim();
            let userId = '';
            let linkId = '';
            if (subtag.includes('__')) {
                const parts = subtag.split('__');
                userId = parts[0];
                linkId = parts[1];
            }
            else if (subtag) {
                userId = subtag;
            }
            // Check if user exists
            let userRes = userId ? await query('SELECT id, name, commission_rate FROM users WHERE id = $1', [userId]) : { rows: [] };
            if (userRes.rows.length === 0 && linkId) {
                // Fallback: look up user by linkId
                const linkRes = await query('SELECT user_id FROM affiliate_links WHERE id = $1', [linkId]);
                if (linkRes.rows.length > 0) {
                    userId = linkRes.rows[0].user_id;
                    userRes = await query('SELECT id, name, commission_rate FROM users WHERE id = $1', [userId]);
                }
            }
            const rawCommission = parseFloat(order.commission || order.commissionAmount || 0);
            const rawRevenue = parseFloat(order.revenue || order.revenueAmount || 0);
            const productName = order.productName || order.title || `Amazon Item (${order.asin || 'General'})`;
            const country = order.country || 'US';
            if (userRes.rows.length > 0) {
                const partner = userRes.rows[0];
                const commissionRate = parseFloat(partner.commission_rate) || 0.70;
                const partnerCommission = parseFloat((rawCommission * commissionRate).toFixed(2));
                // Insert into earnings_reports
                await query(`INSERT INTO earnings_reports (
            user_id, link_id, month, product_name, ordered_count, shipped_count,
            returned_count, revenue_amount, commission_amount, status, country
          ) VALUES ($1, $2, $3, $4, 1, 1, 0, $5, $6, 'active', $7)`, [userId, linkId || null, currentMonth, productName, rawRevenue, partnerCommission, country]);
                // Update partner's owed and lifetime earnings
                const updatedUser = await query(`UPDATE users SET
            currently_owed = currently_owed + $1,
            lifetime_earnings = lifetime_earnings + $1,
            updated_at = NOW()
           WHERE id = $2
           RETURNING currently_owed, lifetime_earnings`, [partnerCommission, userId]);
                attributedCount++;
                processedResults.push({
                    asin: order.asin,
                    userId,
                    partnerName: partner.name,
                    rawCommission,
                    commissionRate: `${(commissionRate * 100).toFixed(0)}%`,
                    partnerEarned: partnerCommission,
                    newCurrentlyOwed: parseFloat(updatedUser.rows[0].currently_owed),
                    status: 'attributed'
                });
            }
            else {
                unattributedCount++;
                processedResults.push({
                    asin: order.asin,
                    subtag,
                    rawCommission,
                    status: 'unattributed_user_not_found'
                });
            }
        }
        // Broadcast SSE update so open admin/partner dashboards immediately reflect the earnings
        realtimeHub.broadcast({
            type: 'EARNINGS_UPDATED',
            month: currentMonth,
            attributedCount,
        });
        return res.json({
            success: true,
            message: `Processed ${orders.length} orders: ${attributedCount} successfully attributed to partners, ${unattributedCount} unattributed`,
            attributedCount,
            unattributedCount,
            orders: processedResults,
        });
    }
    catch (err) {
        console.error('importAmazonOrders error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
