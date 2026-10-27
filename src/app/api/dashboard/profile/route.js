import { handleApi } from '@/backend/adapter';
import { updateProfile } from '@/backend/controllers/dashboardController';

export async function POST(request, context) {
    return handleApi(request, updateProfile, { context, requireAuth: true });
}
