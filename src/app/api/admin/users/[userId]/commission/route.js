import { handleApi } from '@/backend/adapter';
import { updateUserCommission } from '@/backend/controllers/adminController';

export async function PUT(request, context) {
    return handleApi(request, updateUserCommission, { context, requireAdmin: true });
}
