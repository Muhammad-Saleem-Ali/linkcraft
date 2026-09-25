import { NextResponse } from 'next/server';
import globalStore from '@/server/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`)
      );

      const onRealtimeEvent = (eventData: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
        } catch (err) {
          // Controller might be closed
        }
      };

      globalStore.on('realtime-event', onRealtimeEvent);

      // Heartbeat interval every 15s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'HEARTBEAT' })}\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
        }
      }, 15000);

      // Clean up when client disconnects
      return () => {
        globalStore.off('realtime-event', onRealtimeEvent);
        clearInterval(heartbeat);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
