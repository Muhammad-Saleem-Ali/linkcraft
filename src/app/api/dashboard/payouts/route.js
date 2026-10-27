import { handleApi } from '@/backend/adapter';
import { getPayouts } from '@/backend/controllers/dashboardController';

export async function GET(request, context) {
    return handleApi(request, getPayouts, { context, requireAuth: true });
}
