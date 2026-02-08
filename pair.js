// NOXTALIS PAIRING SCRIPT

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startPairing() {
    console.clear();
    console.log(chalk.cyan(`
    ╔══════════════════════════════════════╗
    ║   🕷️ NOXTALIS PAIRING SYSTEM 🕷️    ║
    ╚══════════════════════════════════════╝
    `));
    
    const phoneNumber = await question(chalk.yellow('📱 Enter WhatsApp number (237XXXXXXXXX): '));
    
    if (!phoneNumber) {
        console.log(chalk.red('❌ Invalid number!'));
        process.exit(1);
    }
    
    console.log(chalk.cyan('\n⏳ Initializing...\n'));
    
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu('NOXTALIS'),
        auth: state
    });
    
    if (!sock.authState.creds.registered) {
        console.log(chalk.green(`📱 Number: ${phoneNumber}`));
        console.log(chalk.yellow('⏳ Generating pairing code...\n'));
        
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(chalk.green('┏━━━━━━━━━━━━━━━━━━━━━━━━┓'));
                console.log(chalk.green(`┃   CODE: ${code.toUpperCase()}   ┃`));
                console.log(chalk.green('┗━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));
                console.log(chalk.cyan('📲 STEPS:'));
                console.log(chalk.white('   1. Open WhatsApp'));
                console.log(chalk.white('   2. Menu > Linked Devices'));
                console.log(chalk.white('   3. Link a Device'));
                console.log(chalk.white('   4. Enter code above\n'));
            } catch (error) {
                console.log(chalk.red('❌ Error: ' + error.message));
                process.exit(1);
            }
        }, 3000);
    }
    
    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        
        if (connection === 'open') {
            console.log(chalk.green('\n✅ CONNECTED! 🎉'));
            console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            console.log(chalk.yellow('📁 Session saved in ./sessions'));
            console.log(chalk.yellow('🚀 Start bot: npm start'));
            console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
            process.exit(0);
        }
        
        if (connection === 'close') {
            console.log(chalk.red('❌ Connection closed!'));
            process.exit(1);
        }
    });
    
    sock.ev.on('creds.update', saveCreds);
}

startPairing().catch(err => {
    console.log(chalk.red('❌ Fatal error: ' + err.message));
    process.exit(1);
});
