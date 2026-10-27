import { handleApi } from '@/backend/adapter';
import { deleteLinkedWhatsAppAccount } from '@/backend/controllers/dashboardController';

export async function DELETE(request, context) {
    return handleApi(request, deleteLinkedWhatsAppAccount, { context, requireAuth: true });
}
