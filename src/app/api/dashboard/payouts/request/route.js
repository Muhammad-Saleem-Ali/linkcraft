import { handleApi } from '@/backend/adapter';
import { requestPayout } from '@/backend/controllers/dashboardController';

export async function POST(request, context) {
    return handleApi(request, requestPayout, { context, requireAuth: true });
}
