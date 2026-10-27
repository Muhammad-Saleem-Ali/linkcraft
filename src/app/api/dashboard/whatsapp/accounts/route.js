import { handleApi } from '@/backend/adapter';
import { getLinkedWhatsAppAccounts } from '@/backend/controllers/dashboardController';

export async function GET(request, context) {
    return handleApi(request, getLinkedWhatsAppAccounts, { context, requireAuth: true });
}
