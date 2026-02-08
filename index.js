const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const figlet = require('figlet');
const { Boom } = require('@hapi/boom');
const express = require('express');
const path = require('path');

// Import
const handler = require('./helper/handler');
const { color } = require('./helper/colours');
const config = require('./database/db');

// Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>🕷️ NOXTALIS BOT - Shadow Matrix Active</h1>');
});

app.listen(PORT, () => {
    console.log(chalk.green(`🌐 Panel: http://localhost:${PORT}`));
});

// Store
const store = makeInMemoryStore({ 
    logger: pino().child({ level: 'silent' }) 
});

// Banner
function displayBanner() {
    console.clear();
    console.log(chalk.magenta(figlet.textSync('NOXTALIS', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default'
    })));
    
    console.log(chalk.cyan('╔══════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║     🕷️  SHADOW MATRIX INITIALIZED  🕷️      ║'));
    console.log(chalk.cyan('╚══════════════════════════════════════════════╝'));
    console.log(chalk.yellow(`  Version    : ${config.version}`));
    console.log(chalk.yellow(`  Developer  : ${config.owner}`));
    console.log(chalk.yellow(`  Prefix     : ${config.prefix}`));
    console.log(chalk.yellow(`  Mode       : ${config.mode}`));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

// Start
async function startNoxtalis() {
    displayBanner();
    
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu('NOXTALIS'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message || undefined;
            }
            return { conversation: 'NOXTALIS' };
        },
        generateHighQualityLinkPreview: true
    });

    store?.bind(sock.ev);

    // PAIRING CODE
    if (!sock.authState.creds.registered) {
        console.log(chalk.cyan('\n🔐 PAIRING CODE SYSTEM'));
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        
        const phoneNumber = config.pairingNumber || process.env.PHONE_NUMBER;
        
        if (!phoneNumber || phoneNumber === '237XXXXXXXXX') {
            console.log(chalk.red('❌ No number configured!'));
            console.log(chalk.yellow('📝 Add your number in database/db.js'));
            console.log(chalk.yellow('   Format: 237XXXXXXXXX (without +)'));
            process.exit(1);
        }

        console.log(chalk.green(`📱 Number: ${phoneNumber}`));
        console.log(chalk.yellow('⏳ Generating code...'));
        
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(chalk.green('\n┏━━━━━━━━━━━━━━━━━━━━━━━━┓'));
                console.log(chalk.green(`┃   CODE: ${code.toUpperCase()}   ┃`));
                console.log(chalk.green('┗━━━━━━━━━━━━━━━━━━━━━━━━┛'));
                console.log(chalk.cyan('\n📲 Enter this code in WhatsApp:'));
                console.log(chalk.white('   1. Open WhatsApp'));
                console.log(chalk.white('   2. Menu > Linked Devices'));
                console.log(chalk.white('   3. Link a Device'));
                console.log(chalk.white('   4. Enter the code above\n'));
            } catch (error) {
                console.log(chalk.red('❌ Pairing error: ' + error.message));
                process.exit(1);
            }
        }, 3000);
    }

    // Connection
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) &&
                lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;
            
            console.log(chalk.red('❌ Connection closed'));
            
            if (shouldReconnect) {
                console.log(chalk.yellow('🔄 Reconnecting...'));
                setTimeout(startNoxtalis, 3000);
            } else {
                console.log(chalk.red('🚫 Logged out. Restart to reconnect.'));
                process.exit(0);
            }
        } else if (connection === 'open') {
            console.log(chalk.green('\n✅ NOXTALIS CONNECTED! 🕷️'));
            console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            console.log(chalk.green('⚡ Shadow Matrix: ACTIVATED'));
            console.log(chalk.green('🛡️  Security: ARMED'));
            console.log(chalk.green('🎯 Ready to process commands\n'));
        } else if (connection === 'connecting') {
            console.log(chalk.yellow('🔄 Connecting...'));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0];
            if (!m.message) return;
            
            await handler.handleMessage(sock, m, store);
        } catch (error) {
            console.log(chalk.red('❌ Message error: ' + error.message));
        }
    });

    // Group updates
    sock.ev.on('group-participants.update', async (update) => {
        try {
            await handler.handleGroupUpdate(sock, update);
        } catch (error) {
            console.log(chalk.red('❌ Group error: ' + error.message));
        }
    });

    return sock;
}

// Start
startNoxtalis().catch(err => {
    console.log(chalk.red('❌ Fatal error: ' + err.message));
    process.exit(1);
});

// Error handling
process.on('uncaughtException', (err) => {
    console.log(chalk.red('❌ Uncaught Exception: ' + err.message));
});

process.on('unhandledRejection', (err) => {
    console.log(chalk.red('❌ Unhandled Rejection: ' + err.message));
});
