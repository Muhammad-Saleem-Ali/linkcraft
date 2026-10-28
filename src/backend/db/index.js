import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const hasDbUrl = Boolean(process.env.DATABASE_URL);

if (!hasDbUrl && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: DATABASE_URL environment variable is not defined! Please configure your PostgreSQL connection string in Vercel Project Settings.');
}

const poolConfig = hasDbUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '5433', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ilearner_db',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const globalForPg = globalThis;
export const pool = globalForPg.pgPool || new Pool(poolConfig);
if (process.env.NODE_ENV !== 'production') {
    globalForPg.pgPool = pool;
}
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});
export const query = (text, params) => pool.query(text, params);
