import { EventEmitter } from 'events';
class RealtimeHub extends EventEmitter {
    clients = new Set();
    constructor() {
        super();
        this.setMaxListeners(200);
        // Heartbeat every 15s to keep connections alive
        setInterval(() => {
            this.broadcast({ type: 'HEARTBEAT' });
        }, 15000);
    }
    registerClient(res) {
        this.clients.add(res);
        // Send connection greeting
        res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);
        res.on('close', () => {
            this.clients.delete(res);
        });
    }
    broadcast(data) {
        this.emit('broadcast', data);
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        for (const client of this.clients) {
            try {
                client.write(payload);
            }
            catch (e) {
                this.clients.delete(client);
            }
        }
    }
}
export const realtimeHub = new RealtimeHub();
