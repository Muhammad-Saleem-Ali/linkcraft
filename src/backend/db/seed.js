import bcrypt from 'bcryptjs';
import { pool } from './index.js';

export async function seedDatabase() {
    console.log('Ensuring default admin account exists...');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const adminPasswordHash = await bcrypt.hash('admin123', 10);

        // Seed Admin User if not already present
        await client.query(`
          INSERT INTO users (
            id, name, email, password_hash, phone, role, status,
            commission_rate, currently_owed, lifetime_earnings, total_paid_out,
            bank_name, account_title, iban, store_slug, is_page_live, two_factor_enabled
          ) VALUES (
            'usr_admin',
            'Platform Admin',
            'admin@ilearner.dev',
            $1,
            '+1 800 555 0199',
            'admin',
            'active',
            1.00,
            0.00,
            0.00,
            0.00,
            'State Bank',
            'Platform Admin LLC',
            'PK36SCBL0000001123456701',
            'admin',
            true,
            true
          )
          ON CONFLICT (id) DO NOTHING;
        `, [adminPasswordHash]);

        await client.query('COMMIT');
        console.log('Database initialized successfully with clean admin account.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seed error:', err);
        throw err;
    } finally {
        client.release();
    }
}

import { fileURLToPath } from 'url';

const isDirectRun = Boolean(
    process.argv[1] && (
        fileURLToPath(import.meta.url) === process.argv[1] ||
        process.argv[1].endsWith('seed.js')
    )
);

if (isDirectRun) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

