import { handleApi } from '@/backend/adapter';
import { getPlatformReports } from '@/backend/controllers/adminController';

export async function GET(request, context) {
    return handleApi(request, getPlatformReports, { context, requireAdmin: true });
}
