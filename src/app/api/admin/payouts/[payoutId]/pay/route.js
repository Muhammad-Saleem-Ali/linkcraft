import { handleApi } from '@/backend/adapter';
import { processPayout } from '@/backend/controllers/adminController';

export async function POST(request, context) {
    return handleApi(request, processPayout, { context, requireAdmin: true });
}
