import { NextResponse } from 'next/server';
import { testAmazonCredentials } from '@/backend/utils/amazonCreatorsApi';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const status = await testAmazonCredentials();
        return NextResponse.json({ success: true, ...status });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
