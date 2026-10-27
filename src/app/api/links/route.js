import { handleApi } from '@/backend/adapter';
import { getAllLinks, createLink, revokeLink } from '@/backend/controllers/linksController';

export async function GET(request, context) {
    return handleApi(request, getAllLinks, { context });
}

export async function POST(request, context) {
    return handleApi(request, createLink, { context, requireAuth: true });
}

export async function DELETE(request, context) {
    return handleApi(request, revokeLink, { context, requireAuth: true });
}
