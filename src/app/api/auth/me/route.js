import { handleApi } from '@/backend/adapter';
import { getMe } from '@/backend/controllers/authController';

export async function GET(request, context) {
    return handleApi(request, getMe, { context, requireAuth: true });
}
