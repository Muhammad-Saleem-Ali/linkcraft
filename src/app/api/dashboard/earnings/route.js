import { handleApi } from '@/backend/adapter';
import { getEarnings } from '@/backend/controllers/dashboardController';

export async function GET(request, context) {
    return handleApi(request, getEarnings, { context, requireAuth: true });
}
