import { handleApi } from '@/backend/adapter';
import { getAllPayouts } from '@/backend/controllers/adminController';

export async function GET(request, context) {
    return handleApi(request, getAllPayouts, { context, requireAdmin: true });
}
