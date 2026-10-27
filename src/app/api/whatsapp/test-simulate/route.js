import { handleApi } from '@/backend/adapter';
import { simulateIncomingMessage } from '@/backend/controllers/whatsappController';

export async function POST(request, context) {
    return handleApi(request, simulateIncomingMessage, { context });
}
