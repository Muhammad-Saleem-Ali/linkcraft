import { handleApi } from '@/backend/adapter';
import { login } from '@/backend/controllers/authController';

export async function POST(request, context) {
    return handleApi(request, login, { context });
}
