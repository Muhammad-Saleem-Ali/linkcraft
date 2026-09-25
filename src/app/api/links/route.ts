import { NextResponse } from 'next/server';
import globalStore from '@/server/store';

export async function GET() {
  const links = globalStore.getAllLinks();
  const user = globalStore.getUser();
  return NextResponse.json({ success: true, links, user });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destinationUrl, name, customSlug, country } = body;

    if (!destinationUrl) {
      return NextResponse.json({ success: false, error: 'Destination URL is required' }, { status: 400 });
    }

    const newLink = globalStore.createLink({
      name: name || 'Amazon Product',
      destinationUrl,
      customSlug,
      country,
    });

    return NextResponse.json({ success: true, link: newLink });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required' }, { status: 400 });
    }

    const revoked = globalStore.revokeLink(slug);
    return NextResponse.json({ success: revoked });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
