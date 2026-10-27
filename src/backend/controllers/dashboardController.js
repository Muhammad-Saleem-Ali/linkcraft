import { query } from '../db/index.js';
export async function getOverviewStats(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json({
                success: true,
                stats: {
                    views: 0,
                    clicks: 0,
                    links: 0,
                    conversion: '0.0%',
                    currentlyOwed: 0.0,
                    lifetimeEarnings: 0.0,
                    totalPaidOut: 0.0,
                    todayViews: 0,
                    todayClicks: 0,
                    todayLinks: 0,
                    last7DaysViews: 0,
                    last7DaysClicks: 0,
                    monthlyPending: [],
                    bestPerformers: [],
                    recentLinks: [],
                },
            });
        }
        // 1. Fetch user data
        const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const user = userRes.rows[0];
        // 2. Fetch aggregate stats from links for this user
        const linksAgg = await query(`SELECT
        COUNT(*)::int as total_links,
        COALESCE(SUM(views), 0)::int as total_views,
        COALESCE(SUM(clicks), 0)::int as total_clicks
       FROM affiliate_links
       WHERE user_id = $1 AND status != 'revoked'`, [userId]);
        const stats = linksAgg.rows[0];
        const conversionRate = stats.total_views > 0
            ? ((stats.total_clicks / stats.total_views) * 100).toFixed(1) + '%'
            : '0.0%';
        // Today & Last 7 days metrics
        const todayAgg = await query(`SELECT
        COUNT(*)::int as today_links,
        COALESCE(SUM(views), 0)::int as today_views,
        COALESCE(SUM(clicks), 0)::int as today_clicks
       FROM affiliate_links
       WHERE user_id = $1 AND status != 'revoked' AND created_at >= CURRENT_DATE`, [userId]);
        const last7DaysAgg = await query(`SELECT
        COALESCE(SUM(views), 0)::int as last_7_days_views,
        COALESCE(SUM(clicks), 0)::int as last_7_days_clicks
       FROM affiliate_links
       WHERE user_id = $1 AND status != 'revoked' AND created_at >= NOW() - INTERVAL '7 days'`, [userId]);
        // 3. Best performers for this user
        const bestPerformersRes = await query(`SELECT name as title, clicks, views,
        CASE WHEN views > 0 THEN ROUND((clicks::numeric / views::numeric * 100), 1) || '%' ELSE '0.0%' END as conv
       FROM affiliate_links
       WHERE user_id = $1 AND status != 'revoked'
       ORDER BY clicks DESC, views DESC
       LIMIT 7`, [userId]);
        // 4. Recent links for this user
        const recentLinksRes = await query(`SELECT id, short_slug as "shortSlug", name as title, views, clicks, country
       FROM affiliate_links
       WHERE user_id = $1 AND status != 'revoked'
       ORDER BY created_at DESC
       LIMIT 5`, [userId]);
        // 5. Monthly breakdown from real earnings reports
        const monthlyReports = await query(`SELECT month, status, COALESCE(SUM(revenue_amount), 0) as amount
       FROM earnings_reports
       WHERE user_id = $1
       GROUP BY month, status
       ORDER BY month DESC LIMIT 5`, [userId]);
        const monthlyPending = monthlyReports.rows.map(r => ({
            month: r.month,
            status: r.status === 'paid' ? 'Paid' : 'Pending',
            amount: parseFloat(r.amount),
            statusType: r.status === 'paid' ? 'success' : 'warning',
        }));
        return res.json({
            success: true,
            stats: {
                views: stats.total_views,
                clicks: stats.total_clicks,
                links: stats.total_links,
                conversion: conversionRate,
                todayViews: todayAgg.rows[0]?.today_views || 0,
                todayClicks: todayAgg.rows[0]?.today_clicks || 0,
                todayLinks: todayAgg.rows[0]?.today_links || 0,
                last7DaysViews: last7DaysAgg.rows[0]?.last_7_days_views || 0,
                last7DaysClicks: last7DaysAgg.rows[0]?.last_7_days_clicks || 0,
                currentlyOwed: parseFloat(user.currently_owed || 0),
                lifetimeEarnings: parseFloat(user.lifetime_earnings || 0),
                totalPaidOut: parseFloat(user.total_paid_out || 0),
                monthlyPending,
                bestPerformers: bestPerformersRes.rows,
                recentLinks: recentLinksRes.rows,
            },
        });
    }
    catch (err) {
        console.error('getOverviewStats error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getChartData(req, res) {
    try {
        const userId = req.user?.id;
        const { range = '7-Day Trends' } = req.query;
        if (!userId) {
            return res.json({
                success: true,
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    maxY: 10,
                    yTicks: [10, 8, 6, 4, 2, 0],
                    series1: { name: 'Views', color: '#0EA5E9', values: [0, 0, 0, 0, 0, 0, 0] },
                    series2: { name: 'Clicks', color: '#06B6D4', values: [0, 0, 0, 0, 0, 0, 0] },
                },
            });
        }
        // Query actual links count & clicks for this user
        const linksRes = await query(`SELECT name, views, clicks FROM affiliate_links WHERE user_id = $1 AND status != 'revoked' ORDER BY clicks DESC LIMIT 6`, [userId]);
        const totalViews = linksRes.rows.reduce((sum, r) => sum + (r.views || 0), 0);
        const totalClicks = linksRes.rows.reduce((sum, r) => sum + (r.clicks || 0), 0);
        const chartDatasets = {
            '7-Day Trends': {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                maxY: totalViews > 0 ? Math.max(10, Math.ceil(totalViews * 0.4)) : 10,
                yTicks: [10, 8, 6, 4, 2, 0],
                series1: {
                    name: 'Views',
                    color: '#0EA5E9',
                    values: totalViews > 0 ? [Math.round(totalViews * 0.1), Math.round(totalViews * 0.15), Math.round(totalViews * 0.25), Math.round(totalViews * 0.2), Math.round(totalViews * 0.18), Math.round(totalViews * 0.08), Math.round(totalViews * 0.04)] : [0, 0, 0, 0, 0, 0, 0],
                },
                series2: {
                    name: 'Clicks',
                    color: '#06B6D4',
                    values: totalClicks > 0 ? [Math.round(totalClicks * 0.1), Math.round(totalClicks * 0.15), Math.round(totalClicks * 0.25), Math.round(totalClicks * 0.2), Math.round(totalClicks * 0.18), Math.round(totalClicks * 0.08), Math.round(totalClicks * 0.04)] : [0, 0, 0, 0, 0, 0, 0],
                },
            },
            'Monthly': {
                labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                maxY: totalViews > 0 ? Math.max(50, totalViews) : 50,
                yTicks: [50, 37, 25, 12, 0],
                series1: { name: 'Monthly Views', color: '#0EA5E9', values: totalViews > 0 ? [0, 0, 0, 0, Math.round(totalViews * 0.4), Math.round(totalViews * 0.6)] : [0, 0, 0, 0, 0, 0] },
                series2: { name: 'Monthly Clicks', color: '#10B981', values: totalClicks > 0 ? [0, 0, 0, 0, Math.round(totalClicks * 0.4), Math.round(totalClicks * 0.6)] : [0, 0, 0, 0, 0, 0] },
            },
            'Revenue': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                maxY: 1000,
                yTicks: [1000, 750, 500, 250, 0],
                series1: { name: 'Gross Revenue (Rs.)', color: '#10B981', values: [0, 0, 0, 0] },
                series2: { name: 'Your Commission (Rs.)', color: '#06B6D4', values: [0, 0, 0, 0] },
            },
            'Top Products': {
                labels: linksRes.rows.length > 0 ? linksRes.rows.map(r => r.name.slice(0, 18)) : ['No Products Yet'],
                maxY: totalClicks > 0 ? Math.max(10, totalClicks) : 10,
                yTicks: [10, 8, 6, 4, 2, 0],
                series1: { name: 'Product Clicks', color: '#06B6D4', values: linksRes.rows.length > 0 ? linksRes.rows.map(r => r.clicks || 0) : [0] },
            },
        };
        const data = chartDatasets[String(range)] || chartDatasets['7-Day Trends'];
        return res.json({ success: true, data });
    }
    catch (err) {
        console.error('getChartData error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getEarnings(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json({ success: true, reports: [] });
        }
        const { month, country = 'All countries' } = req.query;
        let sql = `SELECT * FROM earnings_reports WHERE user_id = $1`;
        const params = [userId];
        if (month) {
            params.push(month);
            sql += ` AND month = $${params.length}`;
        }
        if (country && country !== 'All countries') {
            params.push(`%${country}%`);
            sql += ` AND country ILIKE $${params.length}`;
        }
        sql += ` ORDER BY created_at DESC`;
        const result = await query(sql, params);
        return res.json({
            success: true,
            month: month || 'Current',
            country,
            reports: result.rows.map(r => ({
                id: r.id,
                productName: r.product_name,
                orderedCount: r.ordered_count,
                shippedCount: r.shipped_count,
                returnedCount: r.returned_count,
                revenueAmount: parseFloat(r.revenue_amount || 0),
                commissionAmount: parseFloat(r.commission_amount || 0),
                status: r.status,
                country: r.country,
            })),
        });
    }
    catch (err) {
        console.error('getEarnings error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getPayouts(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json({ success: true, totalPaidOut: 0, payouts: [] });
        }
        const result = await query(`SELECT * FROM payouts WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        const userRes = await query('SELECT total_paid_out FROM users WHERE id = $1', [userId]);
        const totalPaid = userRes.rows.length > 0 ? parseFloat(userRes.rows[0].total_paid_out || 0) : 0;
        return res.json({
            success: true,
            totalPaidOut: totalPaid,
            payouts: result.rows.map(r => ({
                id: r.id,
                payoutTag: r.payout_tag,
                amount: `Rs. ${parseFloat(r.amount).toLocaleString()}`,
                status: r.status === 'paid' ? 'Paid' : 'Pending',
                date: r.paid_at ? new Date(r.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending',
                flags: r.countries,
                covers: `Covers ${r.month_covered}`,
                receiptTitle: r.receipt_title,
            })),
        });
    }
    catch (err) {
        console.error('getPayouts error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function requestPayout(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Please log in' });
        }
        const { amount, monthCovered = 'Current Owed' } = req.body;
        const userRes = await query('SELECT currently_owed FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const currentlyOwed = parseFloat(userRes.rows[0].currently_owed || 0);
        const requestedAmount = amount ? parseFloat(amount) : currentlyOwed;
        if (requestedAmount <= 0) {
            return res.status(400).json({ success: false, error: 'Cannot request payout with Rs. 0 balance' });
        }
        const payoutId = `tx-${Date.now()}`;
        const payoutTag = `PAYOUT#${Math.floor(200 + Math.random() * 800)}`;
        await query(`INSERT INTO payouts (id, payout_tag, user_id, amount, status, month_covered, countries, payment_method, receipt_title)
       VALUES ($1, $2, $3, $4, 'pending', $5, '🇺🇸 US', 'Direct Bank Transfer', $6)`, [payoutId, payoutTag, userId, requestedAmount, monthCovered, `Payout request — ${payoutTag}`]);
        return res.status(201).json({
            success: true,
            message: 'Payout request submitted successfully and queued for admin review',
            payoutId,
            payoutTag,
        });
    }
    catch (err) {
        console.error('requestPayout error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function updateProfile(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Please log in' });
        }
        const { fullName, phone, bankName, accountTitle, iban, storeSlug, isPageLive } = req.body;
        const updates = [];
        const values = [];
        if (fullName !== undefined) {
            values.push(fullName);
            updates.push(`name = $${values.length}`);
        }
        if (phone !== undefined) {
            values.push(phone);
            updates.push(`phone = $${values.length}`);
        }
        if (bankName !== undefined) {
            values.push(bankName);
            updates.push(`bank_name = $${values.length}`);
        }
        if (accountTitle !== undefined) {
            values.push(accountTitle);
            updates.push(`account_title = $${values.length}`);
        }
        if (iban !== undefined) {
            values.push(iban);
            updates.push(`iban = $${values.length}`);
        }
        if (storeSlug !== undefined) {
            values.push(storeSlug.toLowerCase().replace(/[^a-z0-9]/g, ''));
            updates.push(`store_slug = $${values.length}`);
        }
        if (isPageLive !== undefined) {
            values.push(Boolean(isPageLive));
            updates.push(`is_page_live = $${values.length}`);
        }
        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'No fields provided to update' });
        }
        values.push(userId);
        const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
        const result = await query(sql, values);
        return res.json({ success: true, message: 'Profile updated successfully', user: result.rows[0] });
    }
    catch (err) {
        console.error('updateProfile error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function generatePairingCode(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Please log in' });
        }
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const expiresAt = new Date(Date.now() + 120 * 1000); // 2 minutes
        await query(`INSERT INTO pairing_codes (user_id, code, expires_at) VALUES ($1, $2, $3)`, [userId, code, expiresAt]);
        return res.json({
            success: true,
            code,
            expiresAt: expiresAt.toISOString(),
            expiresInSeconds: 120,
        });
    }
    catch (err) {
        console.error('generatePairingCode error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getLinkedWhatsAppAccounts(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json({ success: true, accounts: [] });
        }
        const result = await query(`SELECT id, name, phone_or_lid as phone, tag, status, created_at as "createdAt"
       FROM linked_accounts
       WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
        return res.json({ success: true, accounts: result.rows });
    }
    catch (err) {
        console.error('getLinkedWhatsAppAccounts error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function deleteLinkedWhatsAppAccount(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const { id } = req.params;
        const result = await query(`DELETE FROM linked_accounts WHERE id = $1 AND user_id = $2 RETURNING id`, [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Linked account not found' });
        }
        return res.json({ success: true, message: 'Account unlinked successfully' });
    }
    catch (err) {
        console.error('deleteLinkedWhatsAppAccount error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
