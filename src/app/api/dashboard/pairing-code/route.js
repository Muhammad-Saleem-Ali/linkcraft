import { handleApi } from '@/backend/adapter';
import { generatePairingCode } from '@/backend/controllers/dashboardController';

export async function POST(request, context) {
    return handleApi(request, generatePairingCode, { context, requireAuth: true });
}
