import bcrypt from 'bcryptjs';
import { query } from '../db/index.js';
import { generateToken } from '../middleware/auth.js';
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }
        const result = await query('SELECT id, name, email, password_hash, role, status, commission_rate, currently_owed, lifetime_earnings, total_paid_out, store_slug FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        const user = result.rows[0];
        if (user.status === 'suspended') {
            return res.status(403).json({ success: false, error: 'Your affiliate account has been suspended by administration.' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                commissionRate: parseFloat(user.commission_rate),
                currentlyOwed: parseFloat(user.currently_owed),
                lifetimeEarnings: parseFloat(user.lifetime_earnings),
                totalPaidOut: parseFloat(user.total_paid_out),
                storeSlug: user.store_slug,
            },
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function register(req, res) {
    try {
        const { name, email, password, phone, storeSlug } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email and password are required' });
        }
        // Check if email already exists
        const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'An account with this email already exists' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = `usr_${Date.now()}`;
        const slug = storeSlug ? storeSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const result = await query(`INSERT INTO users (
        id, name, email, password_hash, phone, role, status, commission_rate,
        currently_owed, lifetime_earnings, total_paid_out, store_slug
      ) VALUES ($1, $2, $3, $4, $5, 'partner', 'active', 0.70, 0, 0, 0, $6)
      RETURNING id, name, email, role, status, commission_rate, currently_owed, lifetime_earnings, total_paid_out, store_slug`, [userId, name, email.trim(), passwordHash, phone || '', slug]);
        const newUser = result.rows[0];
        const token = generateToken(newUser);
        return res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: newUser.status,
                commissionRate: parseFloat(newUser.commission_rate),
                currentlyOwed: parseFloat(newUser.currently_owed),
                lifetimeEarnings: parseFloat(newUser.lifetime_earnings),
                totalPaidOut: parseFloat(newUser.total_paid_out),
                storeSlug: newUser.store_slug,
            },
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
export async function getMe(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const userId = req.user.id;
        const result = await query(`SELECT id, name, email, phone, role, status, commission_rate,
              currently_owed, lifetime_earnings, total_paid_out,
              bank_name, account_title, iban, store_slug, is_page_live, two_factor_enabled
       FROM users WHERE id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User account not found' });
        }
        const row = result.rows[0];
        return res.json({
            success: true,
            user: {
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                role: row.role,
                status: row.status,
                commissionRate: parseFloat(row.commission_rate),
                currentlyOwed: parseFloat(row.currently_owed),
                lifetimeEarnings: parseFloat(row.lifetime_earnings),
                totalPaidOut: parseFloat(row.total_paid_out),
                bankName: row.bank_name,
                accountTitle: row.account_title,
                iban: row.iban,
                storeSlug: row.store_slug,
                isPageLive: row.is_page_live,
                twoFactorEnabled: row.two_factor_enabled,
            },
        });
    }
    catch (err) {
        console.error('getMe error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
