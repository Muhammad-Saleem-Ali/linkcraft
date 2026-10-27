import { realtimeHub } from '@/backend/utils/realtime';

export const dynamic = 'force-dynamic';

export async function GET() {
    let clientClose;
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const send = (data) => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                } catch {
                    // Client disconnected or stream closed
                }
            };

            // Initial connection greeting
            send({ type: 'CONNECTED', timestamp: Date.now() });

            // Listen to broadcast events
            const onBroadcast = (data) => {
                send(data);
            };

            realtimeHub.on('broadcast', onBroadcast);

            // Heartbeat every 15s to keep connection alive
            const heartbeatInterval = setInterval(() => {
                send({ type: 'HEARTBEAT' });
            }, 15000);

            clientClose = () => {
                clearInterval(heartbeatInterval);
                realtimeHub.off('broadcast', onBroadcast);
            };
        },
        cancel() {
            clientClose?.();
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
