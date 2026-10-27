import { handleApi } from '@/backend/adapter';
import { updateUserStatus } from '@/backend/controllers/adminController';

export async function PUT(request, context) {
    return handleApi(request, updateUserStatus, { context, requireAdmin: true });
}
