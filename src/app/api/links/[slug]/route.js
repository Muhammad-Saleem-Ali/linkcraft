import { handleApi } from '@/backend/adapter';
import { getLinkBySlug, revokeLink } from '@/backend/controllers/linksController';

export async function GET(request, context) {
    return handleApi(request, getLinkBySlug, { context });
}

export async function DELETE(request, context) {
    return handleApi(request, revokeLink, { context, requireAuth: true });
}
