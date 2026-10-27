import { NextResponse } from 'next/server';
import { pool } from '@/backend/db/index';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const dbRes = await pool.query('SELECT NOW() as current_time, version()');
        return NextResponse.json({
            status: 'healthy',
            service: 'iLearner Fullstack Engine API (Next.js)',
            timestamp: new Date(),
            database: {
                connected: true,
                postgresTime: dbRes.rows[0].current_time,
            },
        });
    } catch (err) {
        return NextResponse.json({
            status: 'unhealthy',
            error: err.message,
        }, { status: 500 });
    }
}
