import { handleApi } from '@/backend/adapter';
import { register } from '@/backend/controllers/authController';

export async function POST(request, context) {
    return handleApi(request, register, { context });
}
