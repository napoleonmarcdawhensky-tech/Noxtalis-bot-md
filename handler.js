const config = require('../database/db');
const func = require('./function');
const { color } = require('./colours');
const caseModule = require('../case/case');

class MessageHandler {
    constructor() {
        this.commands = new Map();
        this.cooldowns = new Map();
    }

    async handleMessage(sock, m, store) {
        try {
            if (!m.message) return;
            if (m.key.fromMe) return;

            const messageInfo = this.extractMessageInfo(m);
            const { from, sender, body, isGroup, isOwner, pushname, quoted } = messageInfo;

            // Anti-spam
            if (config.antiSpam.active && !isOwner) {
                if (!this.checkSpam(sender)) {
                    return;
                }
            }

            // Auto-read
            if (config.autoRead) {
                await sock.readMessages([m.key]);
            }

            // Check if command
            if (!body.startsWith(config.prefix)) {
                func.incrementStats('message');
                return;
            }

            const args = body.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            // Log command
            if (config.dev.logCommands) {
                console.log(color(`📩 Command: ${command} | User: ${pushname}`, 'cyan'));
            }

            // Typing
            if (config.autoTyping) {
                await sock.sendPresenceUpdate('composing', from);
            }

            // React
            if (config.autoReact) {
                await sock.sendMessage(from, {
                    react: { text: '⚡', key: m.key }
                });
            }

            // Reply function
            const reply = async (text, options = {}) => {
                return await sock.sendMessage(from, {
                    text: text,
                    ...options
                }, { quoted: m });
            };

            // Context
            const context = {
                sock,
                m,
                from,
                sender,
                body,
                command,
                args,
                isGroup,
                isOwner,
                pushname,
                quoted,
                reply,
                config,
                func,
                store
            };

            // Execute command
            await caseModule.executeCommand(context);

            // Stats
            func.incrementStats('command');

            // Clear typing
            if (config.autoTyping) {
                await sock.sendPresenceUpdate('available', from);
            }

        } catch (error) {
            console.log(color('❌ Handler Error: ' + error.message, 'red'));
        }
    }

    extractMessageInfo(m) {
        const from = m.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? m.key.participant : from;
        const pushname = m.pushName || 'User';
        
        const messageType = Object.keys(m.message)[0];
        let body = '';
        
        if (messageType === 'conversation') {
            body = m.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = m.message.extendedTextMessage.text;
        } else if (messageType === 'imageMessage') {
            body = m.message.imageMessage.caption || '';
        } else if (messageType === 'videoMessage') {
            body = m.message.videoMessage.caption || '';
        }

        const isOwner = func.isOwner(sender);
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

        return {
            from,
            sender,
            body,
            isGroup,
            isOwner,
            pushname,
            quoted,
            messageType
        };
    }

    checkSpam(sender) {
        const now = Date.now();
        const cooldownAmount = 60 * 1000;

        if (this.cooldowns.has(sender)) {
            const expirationTime = this.cooldowns.get(sender) + cooldownAmount;
            
            if (now < expirationTime) {
                return false;
            }
        }

        this.cooldowns.set(sender, now);
        setTimeout(() => this.cooldowns.delete(sender), cooldownAmount);
        return true;
    }

    async handleGroupUpdate(sock, update) {
        try {
            const { id, participants, action } = update;
            
            const db = func.readDatabase();
            const welcomeSettings = db.settings.welcome?.[id] || { active: false };
            const goodbyeSettings = db.settings.goodbye?.[id] || { active: false };

            for (const participant of participants) {
                if (action === 'add' && welcomeSettings.active) {
                    const welcomeMsg = `╔══════════════════════════╗
║   🕷️ WELCOME  🕷️           ║
╚══════════════════════════╝

👋 Welcome @${participant.split('@')[0]}!

⚡ *NOXTALIS* welcomes you!
🌑 Type ${config.prefix}menu for commands

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕷️  Shadow Matrix greets you
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

                    await sock.sendMessage(id, {
                        text: welcomeMsg,
                        mentions: [participant]
                    });
                } else if (action === 'remove' && goodbyeSettings.active) {
                    const goodbyeMsg = `👋 *Goodbye* @${participant.split('@')[0]}

🕷️  Another shadow fades...
🌑 _May darkness guide you_`;

                    await sock.sendMessage(id, {
                        text: goodbyeMsg,
                        mentions: [participant]
                    });
                }
            }
        } catch (error) {
            console.log(color('❌ Group Update Error: ' + error.message, 'red'));
        }
    }
}

const handler = new MessageHandler();

module.exports = {
    handleMessage: handler.handleMessage.bind(handler),
    handleGroupUpdate: handler.handleGroupUpdate.bind(handler)
};
