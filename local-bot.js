// Local WhatsApp bot entry point using Baileys
require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');

// Load config
env = require('dotenv').config();
const OWNER_NUMBER = process.env.OWNER_NUMBER || '';
const SESSION_ID = process.env.SESSION_ID || '';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('✅ Bot connected! Sending startup message...');
            if (OWNER_NUMBER) {
                await sock.sendMessage(
                    OWNER_NUMBER.includes('@s.whatsapp.net') ? OWNER_NUMBER : OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net',
                    { text: 'Hello Alpha Legrand! Your SIGMA bot is now online and ready.' }
                );
                console.log('Startup message sent to owner.');
            } else {
                console.log('OWNER_NUMBER not set in config.env');
            }
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        }
    });
}

startBot();
