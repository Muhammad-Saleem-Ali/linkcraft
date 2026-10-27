import { handleApi } from '@/backend/adapter';
import { handleTwilioWebhook } from '@/backend/controllers/whatsappController';

export async function POST(request, context) {
    return handleApi(request, handleTwilioWebhook, { context });
}
