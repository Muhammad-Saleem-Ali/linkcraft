import { pool } from './index.js';
export async function runMigrations() {
    console.log('Running PostgreSQL migrations...');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // 1. Users Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        role VARCHAR(20) DEFAULT 'partner',
        status VARCHAR(20) DEFAULT 'active',
        commission_rate NUMERIC(5,2) DEFAULT 0.70,
        currently_owed NUMERIC(12,2) DEFAULT 0.00,
        lifetime_earnings NUMERIC(12,2) DEFAULT 0.00,
        total_paid_out NUMERIC(12,2) DEFAULT 0.00,
        bank_name VARCHAR(100) DEFAULT '',
        account_title VARCHAR(150) DEFAULT '',
        iban VARCHAR(50) DEFAULT '',
        store_slug VARCHAR(50) UNIQUE,
        is_page_live BOOLEAN DEFAULT TRUE,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 2. Affiliate Links Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate_links (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        destination_url TEXT NOT NULL,
        affiliate_url TEXT NOT NULL,
        short_slug VARCHAR(100) UNIQUE NOT NULL,
        short_url VARCHAR(150) NOT NULL,
        showcase_url VARCHAR(150) NOT NULL,
        country VARCHAR(20) DEFAULT '🇺🇸',
        views INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        rating VARCHAR(30) DEFAULT '5.0 ★',
        price VARCHAR(30) DEFAULT '$24.99',
        original_price VARCHAR(30) DEFAULT '$29.99',
        image_url TEXT DEFAULT '',
        asin VARCHAR(30) DEFAULT '',
        features JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 3. Link Clicks Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS link_clicks (
        id SERIAL PRIMARY KEY,
        link_id VARCHAR(50) REFERENCES affiliate_links(id) ON DELETE CASCADE,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        short_slug VARCHAR(100) NOT NULL,
        ip_address VARCHAR(50) DEFAULT '',
        user_agent TEXT DEFAULT '',
        referrer TEXT DEFAULT '',
        country VARCHAR(20) DEFAULT '🇺🇸',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 4. Earnings Reports Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS earnings_reports (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        link_id VARCHAR(50) REFERENCES affiliate_links(id) ON DELETE SET NULL,
        month VARCHAR(50) NOT NULL,
        product_name TEXT NOT NULL,
        ordered_count INTEGER DEFAULT 1,
        shipped_count INTEGER DEFAULT 1,
        returned_count INTEGER DEFAULT 0,
        revenue_amount NUMERIC(12,2) DEFAULT 0.00,
        commission_amount NUMERIC(12,2) DEFAULT 0.00,
        status VARCHAR(30) DEFAULT 'active',
        country VARCHAR(20) DEFAULT 'US',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 5. Payouts Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS payouts (
        id VARCHAR(50) PRIMARY KEY,
        payout_tag VARCHAR(50) DEFAULT 'PAYOUT#202',
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        status VARCHAR(30) DEFAULT 'pending',
        month_covered VARCHAR(50) NOT NULL,
        countries VARCHAR(100) DEFAULT '🇺🇸 🇬🇧',
        payment_method VARCHAR(100) DEFAULT 'Bank Transfer',
        receipt_title VARCHAR(150) DEFAULT 'Payout receipt',
        receipt_url TEXT DEFAULT '',
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 6. Linked WhatsApp Accounts
        await client.query(`
      CREATE TABLE IF NOT EXISTS linked_accounts (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        phone_or_lid VARCHAR(100) NOT NULL,
        tag VARCHAR(50) DEFAULT '8',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 7. Pairing Codes
        await client.query(`
      CREATE TABLE IF NOT EXISTS pairing_codes (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(20) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Create helpful indices
        await client.query(`CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug ON affiliate_links(short_slug);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_affiliate_links_user ON affiliate_links(user_id);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_link_clicks_slug ON link_clicks(short_slug);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_link_clicks_created ON link_clicks(created_at);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_earnings_user_month ON earnings_reports(user_id, month);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_payouts_user ON payouts(user_id);`);
        await client.query('COMMIT');
        console.log('PostgreSQL migrations completed successfully!');
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error running migrations:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
import { fileURLToPath } from 'url';

const isDirectRun = Boolean(
    process.argv[1] && (
        fileURLToPath(import.meta.url) === process.argv[1] ||
        process.argv[1].endsWith('migrate.js')
    )
);

if (isDirectRun) {
    runMigrations()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

