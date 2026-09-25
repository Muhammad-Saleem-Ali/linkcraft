import { NextResponse } from 'next/server';
import globalStore from '@/server/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const link = globalStore.getLinkBySlug(slug);

  if (!link || link.status === 'revoked') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Register click & real-time analytics
  globalStore.registerClick(slug);

  // Redirect to destination Amazon affiliate URL
  const targetUrl = link.affiliateUrl || link.destinationUrl || 'https://www.amazon.com';
  return NextResponse.redirect(targetUrl);
}
