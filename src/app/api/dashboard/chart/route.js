import { handleApi } from '@/backend/adapter';
import { getChartData } from '@/backend/controllers/dashboardController';

export async function GET(request, context) {
    return handleApi(request, getChartData, { context, requireAuth: true });
}
