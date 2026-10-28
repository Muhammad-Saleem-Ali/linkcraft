import { handleApi } from '@/backend/adapter';
import { getPlatformReports, importAmazonOrders } from '@/backend/controllers/adminController';

export async function GET(request, context) {
    return handleApi(request, getPlatformReports, { context, requireAdmin: true });
}

export async function POST(request, context) {
    return handleApi(request, importAmazonOrders, { context, requireAdmin: true });
}
