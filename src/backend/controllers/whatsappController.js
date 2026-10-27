import { processIncomingWhatsAppMessage, normalizePhone } from '../services/whatsappService.js';
/**
 * Meta WhatsApp Cloud API Webhook Verification (GET /api/whatsapp/webhook)
 * Meta sends hub.mode, hub.verify_token, and hub.challenge
 */
export async function verifyMetaWebhook(req, res) {
    try {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        const expectedToken = process.env.META_VERIFY_TOKEN || 'ilearner_whatsapp_verify_token_2026';
        if (mode && token) {
            if (mode === 'subscribe' && token === expectedToken) {
                console.log('✅ Meta WhatsApp webhook verified successfully.');
                return res.status(200).send(challenge);
            }
            else {
                console.warn('❌ Meta WhatsApp webhook verification token mismatch.');
                return res.sendStatus(403);
            }
        }
        return res.status(400).send('Missing hub parameters');
    }
    catch (err) {
        console.error('verifyMetaWebhook error:', err);
        return res.status(500).send(err.message);
    }
}
/**
 * Meta WhatsApp Cloud API Inbound Webhook (POST /api/whatsapp/webhook)
 * Handles incoming WhatsApp messages sent by customers/partners to your Meta Business Number
 */
export async function handleMetaWebhook(req, res) {
    try {
        const body = req.body;
        // Check if this is an event from a WhatsApp Business Account subscription
        if (body.object === 'whatsapp_business_account' || body.entry) {
            for (const entry of body.entry || []) {
                for (const change of entry.changes || []) {
                    const value = change.value;
                    if (value && value.messages && value.messages.length > 0) {
                        for (const msg of value.messages) {
                            // Only handle text or interactive button messages
                            const fromPhone = msg.from; // e.g. "923181494914"
                            const text = msg.text?.body || msg.interactive?.button_reply?.title || '';
                            const senderName = value.contacts?.[0]?.profile?.name;
                            if (text) {
                                // Process asynchronously but log errors
                                processIncomingWhatsAppMessage({
                                    fromPhone,
                                    text,
                                    senderName,
                                    messageId: msg.id,
                                }).catch((err) => console.error('Failed to process Meta WhatsApp message:', err));
                            }
                        }
                    }
                }
            }
            // Meta requires an immediate 200 OK status to prevent webhook retries
            return res.status(200).json({ status: 'received' });
        }
        return res.status(200).json({ status: 'ignored' });
    }
    catch (err) {
        console.error('handleMetaWebhook error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
/**
 * Twilio WhatsApp Inbound Webhook (POST /api/whatsapp/twilio)
 * Twilio sends application/x-www-form-urlencoded with From, Body, etc.
 */
export async function handleTwilioWebhook(req, res) {
    try {
        const rawFrom = req.body.From || ''; // e.g. "whatsapp:+923181494914"
        const text = req.body.Body || '';
        const senderName = req.body.ProfileName;
        const fromPhone = normalizePhone(rawFrom);
        if (!fromPhone || !text) {
            return res.status(400).send('Missing From or Body');
        }
        const reply = await processIncomingWhatsAppMessage({
            fromPhone,
            text,
            senderName,
        });
        // Return TwiML XML response so Twilio immediately replies to the sender
        res.type('text/xml');
        return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Message>
</Response>`);
    }
    catch (err) {
        console.error('handleTwilioWebhook error:', err);
        return res.status(500).send(err.message);
    }
}
/**
 * WhatsApp Dev & Testing Simulator (POST /api/whatsapp/test-simulate)
 * Allows developers and dashboard users to test pairing, link creation, and commands
 * without needing an active Meta/Twilio business account setup.
 */
export async function simulateIncomingMessage(req, res) {
    try {
        const { fromPhone, message, senderName } = req.body;
        if (!fromPhone || !message) {
            return res.status(400).json({ success: false, error: 'fromPhone and message are required' });
        }
        const reply = await processIncomingWhatsAppMessage({
            fromPhone,
            text: message,
            senderName: senderName || 'Simulator User',
        });
        return res.json({
            success: true,
            fromPhone: normalizePhone(fromPhone),
            sentMessage: message,
            reply,
        });
    }
    catch (err) {
        console.error('simulateIncomingMessage error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
