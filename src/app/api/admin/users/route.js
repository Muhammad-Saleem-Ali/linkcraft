import { handleApi } from '@/backend/adapter';
import { getAllUsers, createUserByAdmin } from '@/backend/controllers/adminController';

export async function GET(request, context) {
    return handleApi(request, getAllUsers, { context, requireAdmin: true });
}

export async function POST(request, context) {
    return handleApi(request, createUserByAdmin, { context, requireAdmin: true });
}
