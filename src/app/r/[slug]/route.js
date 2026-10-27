import { handleApi } from '@/backend/adapter';
import { handleRedirect } from '@/backend/controllers/linksController';

export async function GET(request, context) {
    return handleApi(request, handleRedirect, { context });
}
