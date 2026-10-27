import { query } from '../db/index.js';
import { createAffiliateLinkInternal } from '../controllers/linksController.js';
/**
 * Normalizes phone number into international digits without leading '+' or symbols
 */
export function normalizePhone(rawPhone) {
    return rawPhone.replace(/\D/g, '');
}
/**
 * Sends a WhatsApp message via Meta WhatsApp Cloud API or Twilio WhatsApp API
 */
export async function sendWhatsAppMessage(toPhone, text) {
    const provider = (process.env.WHATSAPP_PROVIDER || 'meta').toLowerCase();
    const cleanPhone = normalizePhone(toPhone);
    // 1. Meta WhatsApp Cloud API
    if (provider === 'meta') {
        const token = process.env.META_WHATSAPP_TOKEN;
        const phoneId = process.env.META_PHONE_NUMBER_ID;
        const apiVersion = process.env.META_API_VERSION || 'v21.0';
        if (!token || !phoneId) {
            console.log(`[WhatsApp Meta Cloud API Mock] (Missing META_WHATSAPP_TOKEN or META_PHONE_NUMBER_ID)`);
            console.log(`To: +${cleanPhone}`);
            console.log(`Message:\n${text}`);
            return { success: true, provider: 'mock', response: { mock: true, message: 'Meta credentials not set; logged to console' } };
        }
        try {
            const url = `https://graph.facebook.com/${apiVersion}/${phoneId}/messages`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: cleanPhone,
                    type: 'text',
                    text: {
                        preview_url: true,
                        body: text,
                    },
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Meta WhatsApp Cloud API error:', data);
                return { success: false, provider: 'meta', error: data.error?.message || 'Meta API error' };
            }
            return { success: true, provider: 'meta', response: data };
        }
        catch (err) {
            console.error('Meta WhatsApp fetch exception:', err);
            return { success: false, provider: 'meta', error: err.message };
        }
    }
    // 2. Twilio WhatsApp API
    if (provider === 'twilio') {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
        if (!accountSid || !authToken) {
            console.log(`[WhatsApp Twilio API Mock] (Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN)`);
            console.log(`To: whatsapp:+${cleanPhone}`);
            console.log(`Message:\n${text}`);
            return { success: true, provider: 'mock', response: { mock: true, message: 'Twilio credentials not set; logged to console' } };
        }
        try {
            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
            const bodyParams = new URLSearchParams();
            bodyParams.append('From', fromWhatsAppNumber);
            bodyParams.append('To', `whatsapp:+${cleanPhone}`);
            bodyParams.append('Body', text);
            const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: bodyParams.toString(),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Twilio WhatsApp API error:', data);
                return { success: false, provider: 'twilio', error: data.message || 'Twilio API error' };
            }
            return { success: true, provider: 'twilio', response: data };
        }
        catch (err) {
            console.error('Twilio WhatsApp fetch exception:', err);
            return { success: false, provider: 'twilio', error: err.message };
        }
    }
    // Fallback mock
    console.log(`[WhatsApp Mock Provider] To: +${cleanPhone}\nMessage: ${text}`);
    return { success: true, provider: 'mock' };
}
/**
 * Core bot logic: processes incoming message and returns appropriate reply
 */
export async function processIncomingWhatsAppMessage(incoming) {
    const { fromPhone, text, senderName } = incoming;
    const cleanPhone = normalizePhone(fromPhone);
    const trimmed = text.trim();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    // 1. Check if user sent a 6-digit pairing code (e.g. "5FFN56" or "LINK 5FFN56")
    const pairingMatch = trimmed.match(/^(?:LINK\s+)?([A-Z0-9]{6})$/i);
    if (pairingMatch) {
        const candidateCode = pairingMatch[1].toUpperCase();
        // Query active pairing code in PostgreSQL
        const codeQuery = await query(`SELECT p.*, u.name as user_name, u.store_slug
       FROM pairing_codes p
       JOIN users u ON p.user_id = u.id
       WHERE UPPER(p.code) = $1
         AND p.is_used = false
         AND p.expires_at > NOW()
       ORDER BY p.created_at DESC
       LIMIT 1`, [candidateCode]);
        if (codeQuery.rows.length > 0) {
            const match = codeQuery.rows[0];
            const accountId = `wa-${Date.now()}`;
            const accountName = senderName || `WhatsApp User (+${cleanPhone.slice(-4)})`;
            // Check if this phone number is already linked for this user
            const existingAccount = await query(`SELECT id FROM linked_accounts
         WHERE user_id = $1 AND REPLACE(REPLACE(phone_or_lid, '+', ''), ' ', '') = $2`, [match.user_id, cleanPhone]);
            if (existingAccount.rows.length === 0) {
                await query(`INSERT INTO linked_accounts (id, user_id, name, phone_or_lid, tag, status)
           VALUES ($1, $2, $3, $4, '8', 'active')`, [accountId, match.user_id, accountName, cleanPhone]);
            }
            else {
                await query(`UPDATE linked_accounts SET status = 'active', name = $1, created_at = NOW() WHERE id = $2`, [accountName, existingAccount.rows[0].id]);
            }
            // Mark pairing code as used
            await query(`UPDATE pairing_codes SET is_used = true WHERE id = $1`, [match.id]);
            const reply = `🎉 *Account Successfully Linked!*\n\n` +
                `Hello *${match.user_name}*! Your WhatsApp number (*+${cleanPhone}*) is now connected to LinkCraft (Store: *${match.store_slug || match.user_name}*).\n\n` +
                `🛒 *How to create affiliate links:*\n` +
                `Just paste any Amazon product link here (e.g. amazon.com/dp/B0...) and we will automatically create your tracked link!\n\n` +
                `📊 Send *STATS* anytime to check your live balance and link performance.`;
            await sendWhatsAppMessage(cleanPhone, reply);
            return reply;
        }
        else {
            const reply = `❌ *Invalid or Expired Pairing Code*\n\n` +
                `The code *${candidateCode}* is either incorrect or has expired (codes expire after 2 minutes).\n\n` +
                `👉 Please generate a fresh 6-digit code from your LinkCraft Dashboard: ${frontendUrl}/dashboard`;
            await sendWhatsAppMessage(cleanPhone, reply);
            return reply;
        }
    }
    // 2. Check if user typed STATS or BALANCE
    if (/^(STATS|BALANCE|EARNINGS)$/i.test(trimmed)) {
        // Find partner linked to this phone
        const partnerQuery = await query(`SELECT u.* FROM linked_accounts l
       JOIN users u ON l.user_id = u.id
       WHERE REPLACE(REPLACE(l.phone_or_lid, '+', ''), ' ', '') = $1
         AND l.status = 'active'
       LIMIT 1`, [cleanPhone]);
        if (partnerQuery.rows.length === 0) {
            const reply = `⚠️ *Account Not Linked*\n\n` +
                `Your WhatsApp number (*+${cleanPhone}*) is not connected to a LinkCraft account.\n\n` +
                `👉 Log in at ${frontendUrl}/dashboard -> Settings -> WhatsApp to get your 6-digit pairing code.`;
            await sendWhatsAppMessage(cleanPhone, reply);
            return reply;
        }
        const user = partnerQuery.rows[0];
        // Get aggregated link statistics
        const statsQuery = await query(`SELECT
        COUNT(*)::int as total_links,
        COALESCE(SUM(views), 0)::int as total_views,
        COALESCE(SUM(clicks), 0)::int as total_clicks
       FROM affiliate_links
       WHERE user_id = $1 AND status != 'revoked'`, [user.id]);
        const stats = statsQuery.rows[0];
        const commissionPercent = (parseFloat(user.commission_rate || '0.70') * 100).toFixed(0);
        const reply = `📊 *LinkCraft Performance Summary*\n\n` +
            `👤 *Partner:* ${user.name}\n` +
            `🏪 *Storefront:* ${frontendUrl}/u/${user.store_slug || user.id}\n\n` +
            `💵 *Currently Owed:* Rs. ${parseFloat(user.currently_owed || '0').toLocaleString()}\n` +
            `🏆 *Lifetime Earnings:* Rs. ${parseFloat(user.lifetime_earnings || '0').toLocaleString()}\n` +
            `💳 *Total Paid Out:* Rs. ${parseFloat(user.total_paid_out || '0').toLocaleString()}\n\n` +
            `🔗 *Active Links:* ${stats.total_links}\n` +
            `👀 *Total Views:* ${stats.total_views}\n` +
            `🖱️ *Total Clicks:* ${stats.total_clicks}\n` +
            `📈 *Commission Split:* ${commissionPercent}%\n\n` +
            `🚀 Open dashboard: ${frontendUrl}/dashboard`;
        await sendWhatsAppMessage(cleanPhone, reply);
        return reply;
    }
    // 3. Check if user sent an Amazon URL or ASIN
    const hasAmazonUrl = /amazon\.[a-z\.]+|amzn\.to|a\.co|\/dp\/|\/gp\/product\/|[B0][A-Z0-9]{9}/i.test(trimmed);
    if (hasAmazonUrl) {
        // Check if phone number is linked
        const partnerQuery = await query(`SELECT u.* FROM linked_accounts l
       JOIN users u ON l.user_id = u.id
       WHERE REPLACE(REPLACE(l.phone_or_lid, '+', ''), ' ', '') = $1
         AND l.status = 'active'
       LIMIT 1`, [cleanPhone]);
        if (partnerQuery.rows.length === 0) {
            const reply = `⚠️ *Account Not Linked*\n\n` +
                `Your WhatsApp number (*+${cleanPhone}*) is not yet connected to LinkCraft.\n\n` +
                `👉 *To link in 30 seconds:*\n` +
                `1. Visit: ${frontendUrl}/dashboard\n` +
                `2. Go to *Settings* -> *WhatsApp accounts*\n` +
                `3. Click *+ Link another WhatsApp account*\n` +
                `4. Send the 6-digit code right here in this chat!`;
            await sendWhatsAppMessage(cleanPhone, reply);
            return reply;
        }
        const user = partnerQuery.rows[0];
        // Extract URL or ASIN
        const urlMatch = trimmed.match(/https?:\/\/[^\s]+/i);
        const destinationUrl = urlMatch ? urlMatch[0] : (trimmed.match(/([A-Z0-9]{10})/i)
            ? `https://www.amazon.com/dp/${trimmed.match(/([A-Z0-9]{10})/i)[1]}`
            : trimmed);
        try {
            const newLink = await createAffiliateLinkInternal({
                destinationUrl,
                userId: user.id,
            });
            const reply = `✅ *Affiliate Link Created Successfully!*\n\n` +
                `📦 *${newLink.name}*\n` +
                `💵 *Price:* ${newLink.price}   ⭐ *Rating:* ${newLink.rating}\n\n` +
                `🎯 *Direct Tracked Link (Instant Amazon Redirect):*\n` +
                `${frontendUrl}${newLink.shortUrl}\n\n` +
                `🌐 *Interactive Showcase Page:*\n` +
                `${frontendUrl}${newLink.showcaseUrl}\n\n` +
                `🛒 *Curated Storefront:*\n` +
                `${frontendUrl}/u/${user.store_slug || user.id}\n\n` +
                `_All clicks & sales are automatically attributed to your partner ID (${user.id})._`;
            await sendWhatsAppMessage(cleanPhone, reply);
            return reply;
        }
        catch (err) {
            console.error('Error creating link via WhatsApp:', err);
            const reply = `❌ Could not generate affiliate link for this product: ${err.message}`;
            await sendWhatsAppMessage(cleanPhone, reply);
            return reply;
        }
    }
    // 4. Default Help Message
    const reply = `🤖 *LinkCraft Amazon Affiliate WhatsApp Assistant*\n\n` +
        `Here is what you can do:\n\n` +
        `1️⃣ *Link Your Account:* Send your 6-digit code (e.g. *5FFN56*)\n` +
        `2️⃣ *Generate Affiliate Link:* Paste any Amazon product link or ASIN\n` +
        `3️⃣ *Check Earnings:* Send *STATS* or *BALANCE*\n` +
        `4️⃣ *Get Help:* Send *HELP*\n\n` +
        `🌐 Dashboard: ${frontendUrl}/dashboard`;
    await sendWhatsAppMessage(cleanPhone, reply);
    return reply;
}
