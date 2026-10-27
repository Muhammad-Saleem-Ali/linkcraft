import { handleApi } from '@/backend/adapter';
import { verifyMetaWebhook, handleMetaWebhook } from '@/backend/controllers/whatsappController';

export async function GET(request, context) {
    return handleApi(request, verifyMetaWebhook, { context });
}

export async function POST(request, context) {
    return handleApi(request, handleMetaWebhook, { context });
}
