import { handleApi } from '@/backend/adapter';
import { getAllLinks } from '@/backend/controllers/adminController';

export async function GET(request, context) {
    return handleApi(request, getAllLinks, { context, requireAdmin: true });
}
