import { handleApi } from '@/backend/adapter';
import { getOverviewStats } from '@/backend/controllers/dashboardController';

export async function GET(request, context) {
    return handleApi(request, getOverviewStats, { context, requireAuth: true });
}
