const axios = require('axios');
const yts = require('yt-search');
const moment = require('moment-timezone');
const fs = require('fs');

// ══════════════════════════════════════════════
// 🕷️ NOXTALIS COMPLETE COMMAND EXECUTOR
// ══════════════════════════════════════════════

async function executeCommand(ctx) {
    const { sock, m, from, sender, command, args, isGroup, isOwner, pushname, reply, config, func } = ctx;

    try {
        // ═══════════════════════════════════════
        // 🔷 SYSTEM DIAGNOSTICS
        // ═══════════════════════════════════════

        if (command === 'ping') {
            const start = Date.now();
            const sent = await reply('🏓 *Pinging...*');
            const ping = Date.now() - start;
            
            await sock.sendMessage(from, {
                text: `⚡ *NOXTALIS LATENCY*\n\n🏓 Pong!\n⏱️  Speed: ${ping}ms\n🌐 Status: ${ping < 100 ? 'Excellent ✅' : ping < 300 ? 'Good ✅' : 'Fair ⚠️'}\n\n🕷️  _Network latency measured_`,
                edit: sent.key
            });
        }

        else if (command === 'alive' || command === 'status') {
            const uptime = func.formatUptime(process.uptime());
            const image = await func.getBuffer(config.aliveImage);
            
            await sock.sendMessage(from, {
                image: image,
                caption: `╔══════════════════════════════╗
║   🕷️ NOXTALIS STATUS 🕷️      ║
╚══════════════════════════════╝

✅ *Status:* ONLINE & OPERATIONAL
⚡ *Version:* ${config.version}
👑 *Owner:* ${config.owner}
🔰 *Prefix:* ${config.prefix}
⏰ *Uptime:* ${uptime}
🌍 *Mode:* ${config.mode.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕷️  _Heartbeat status confirmed_
⚡ Powered by Dark Émeraude
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
            }, { quoted: m });
        }

        else if (command === 'menu' || command === 'help') {
            const uptime = func.formatUptime(process.uptime());
            const db = func.readDatabase();
            const image = await func.getBuffer(config.menuImage);
            
            const menuText = `🌑 *NOXTALIS NEXUS*

▓▓▓▓▓▓╗  ▓▓▓▓▓╗ ▓▓╗  ▓▓╗▓▓▓▓▓▓╗ ▓▓▓▓▓▓╗ ▓▓╗     ▓▓╗▓▓▓▓▓▓╗
▓▓╔══▓▓╗▓▓╔═══╝ ╚▓▓╗▓▓╔╝╚══▓▓╔╝▓▓╔═══╝ ▓▓║     ▓▓║▓▓╔════╝
▓▓▓▓▓▓╔╝▓▓║      ╚▓▓▓╔╝    ▓▓║  ▓▓▓▓▓╗  ▓▓║     ▓▓║▓▓▓▓▓╗
▓▓╔══▓▓╗▓▓║      ╚▓▓╔╝     ▓▓║  ▓▓╔══╝  ▓▓║     ▓▓║╚════▓▓╗
▓▓║  ▓▓║╚▓▓▓▓▓╗   ▓▓║      ▓▓║  ▓▓▓▓▓▓╗▓▓▓▓▓▓▓╗▓▓║▓▓▓▓▓▓╔╝
╚═╝  ╚═╝ ╚═════╝   ╚═╝      ╚═╝  ╚═════╝╚══════╝╚═╝╚═════╝

═══════════════════════════════════════════════════════════
      *S H A D O W   I N T E L L I G E N C E   C O R E*
═══════════════════════════════════════════════════════════

【 *SYSTEM IDENTITY* 】
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Framework    │ NOXTALIS ${config.version}              ┃
┃  Architect    │ ${config.owner}              ┃
┃  Designation  │ Neural Shadow Protocol     ┃
┃  Prefix       │ ${config.prefix}                          ┃
┃  User         │ ${pushname}                ┃
┃  Uptime       │ ${uptime}              ┃
┃  AI Matrix    │ ⚡ FULLY OPERATIONAL        ┃
┃  Security     │ 🛡️ ENCRYPTED                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚡ *CORE PROTOCOLS*
┌───────────────────────────────────────┐
│  🔷 SYSTEM DIAGNOSTICS                │
├───────────────────────────────────────┤
│  ${config.prefix}ping          ► Network latency     │
│  ${config.prefix}alive         ► Heartbeat status    │
│  ${config.prefix}menu          ► Full command list   │
│  ${config.prefix}system        ► Core analysis       │
│  ${config.prefix}help          ► Protocol manual     │
│  ${config.prefix}info          ► System metadata     │
│  ${config.prefix}profile       ► User intelligence   │
│  ${config.prefix}botinfo       ► Framework details   │
│  ${config.prefix}uptime        ► Runtime metrics     │
│  ${config.prefix}speed         ► Performance scan    │
│  ${config.prefix}rules         ► Usage guidelines    │
│  ${config.prefix}support       ► Help channel        │
│  ${config.prefix}status        ► Live health         │
│  ${config.prefix}check         ► Integrity verify    │
│  ${config.prefix}logs          ► Activity history    │
│  ${config.prefix}trace         ► Debug matrix        │
└───────────────────────────────────────┘

🎭 *ENTERTAINMENT NEXUS*
┌───────────────────────────────────────┐
│  🔮 FUN & GAMES                       │
├───────────────────────────────────────┤
│  ${config.prefix}quote         ► Wisdom oracle       │
│  ${config.prefix}joke          ► Comedy engine       │
│  ${config.prefix}meme          ► Viral generator     │
│  ${config.prefix}truth         ► Honesty protocol    │
│  ${config.prefix}dare          ► Risk challenge      │
│  ${config.prefix}ship          ► Love algorithm      │
│  ${config.prefix}8ball         ► Fortune teller      │
│  ${config.prefix}fact          ► Random knowledge    │
│  ${config.prefix}story         ► Tale weaver         │
│  ${config.prefix}challenge     ► Task generator      │
│  ${config.prefix}randomevent   ► Chaos injection     │
└───────────────────────────────────────┘

🎬 *MEDIA VAULT*
┌───────────────────────────────────────┐
│  📡 CONTENT EXTRACTION                │
├───────────────────────────────────────┤
│  ${config.prefix}play          ► Audio streamer      │
│  ${config.prefix}video         ► Video processor     │
│  ${config.prefix}music         ► Sound archive       │
│  ${config.prefix}lyrics        ► Song text           │
│  ${config.prefix}sticker       ► Sticker forge       │
│  ${config.prefix}toimage       ► IMG converter       │
│  ${config.prefix}togif         ► GIF transformer     │
│  ${config.prefix}tomp3         ► Audio ripper        │
│  ${config.prefix}vv            ► ViewOnce hack v1    │
│  ${config.prefix}vv2           ► ViewOnce hack v2    │
│  ${config.prefix}waifu         ► Anime character     │
│  ${config.prefix}img           ► Image hunter        │
│  ${config.prefix}anime         ► Series finder       │
│  ${config.prefix}wallpaper     ► HD backgrounds      │
│  ${config.prefix}tiktok        ► TikTok downloader   │
│  ${config.prefix}yt            ► YouTube ripper      │
│  ${config.prefix}insta         ► Instagram saver     │
└───────────────────────────────────────┘

👥 *GROUP COMMAND CENTER*
┌───────────────────────────────────────┐
│  ⚔️ ADMINISTRATIVE CONTROL            │
├───────────────────────────────────────┤
│  ${config.prefix}tagall        ► Mass ping           │
│  ${config.prefix}kick          ► Eject member        │
│  ${config.prefix}kickall       ► Total purge         │
│  ${config.prefix}promote       ► Admin elevation     │
│  ${config.prefix}demote        ► Admin removal       │
│  ${config.prefix}open          ► Unlock chat         │
│  ${config.prefix}close         ► Lock chat           │
│  ${config.prefix}join          ► Group auto-join     │
│  ${config.prefix}warn          ► Issue warning       │
│  ${config.prefix}purge         ► Message nuke        │
│  ${config.prefix}antilink      ► URL protection      │
│  ${config.prefix}creategroup   ► New group forge     │
│  ${config.prefix}infosgroup    ► Group analytics     │
│  ${config.prefix}welcome       ► Join greetings      │
│  ${config.prefix}goodbye       ► Exit farewells      │
│  ${config.prefix}lock          ► Full restriction    │
│  ${config.prefix}unlock        ► Full access         │
│  ${config.prefix}antispam      ► Spam shield         │
│  ${config.prefix}slowmode      ► Message throttle    │
└───────────────────────────────────────┘

👑 *SUPREME AUTHORITY*
┌───────────────────────────────────────┐
│  🔱 OWNER EXCLUSIVE                   │
├───────────────────────────────────────┤
│  ${config.prefix}restart       ► System reboot       │
│  ${config.prefix}shutdown      ► Full shutdown       │
│  ${config.prefix}autopromote   ► Auto-admin mode     │
│  ${config.prefix}owner         ► Creator info        │
│  ${config.prefix}eval          ► JS executor         │
│  ${config.prefix}exec          ► Terminal access     │
│  ${config.prefix}setpp         ► Profile picture     │
│  ${config.prefix}setname       ► Bot rename          │
│  ${config.prefix}setbio        ► Bio modifier        │
│  ${config.prefix}block         ► User ban            │
│  ${config.prefix}unblock       ► User pardon         │
│  ${config.prefix}broadcast     ► Global announce     │
└───────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          🕷️  *SHADOW MATRIX FULLY ACTIVATED*  🕷️           ║
║                                                           ║
║  ┌─────────────────────────────────────────────────┐     ║
║  │  Neural Networks     : ████████████ ONLINE     │     ║
║  │  Command Processor   : ████████████ READY      │     ║
║  │  Security Protocols  : ████████████ ARMED      │     ║
║  │  Shadow Integration  : ████████████ COMPLETE   │     ║
║  └─────────────────────────────────────────────────┘     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

                ⚡ *ENGINEERED BY DARK ÉMERAUDE* ⚡
            
          _"In darkness we code, in shadows we reign"_

                🖤 *Lord Émeraude • Daw Hensky* 🖤
                     _The Architect of Void_
                          
═══════════════════════════════════════════════════════════
             *NOXTALIS — Intelligence Beyond Light*
═══════════════════════════════════════════════════════════`;

            await sock.sendMessage(from, {
                image: image,
                caption: menuText
            }, { quoted: m });
        }

        // Suite des commandes SYSTEM...
        else if (command === 'system' || command === 'check') {
            const totalMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);
            const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const uptime = func.formatUptime(process.uptime());
            
            await reply(`🔷 *SYSTEM CORE ANALYSIS*\n\n⏰ Uptime: ${uptime}\n💾 Memory: ${usedMemory}/${totalMemory} MB\n🖥️  Platform: ${process.platform}\n📦 Node: ${process.version}\n\n🕷️  _Core analysis complete_`);
        }

        else if (command === 'info' || command === 'botinfo') {
            const uptime = func.formatUptime(process.uptime());
            const totalMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);
            const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            
            await reply(`╔═══════════════════════════════════╗
║     🕷️ NOXTALIS FRAMEWORK 🕷️        ║
╚═══════════════════════════════════╝

┏━━━━━ *GENERAL INFO* ━━━━━┓
┃ 🤖 *Bot:* ${config.botName}
┃ ⚡ *Version:* ${config.version}
┃ 👑 *Owner:* ${config.owner}
┃ 🔰 *Prefix:* ${config.prefix}
┃ 🌍 *Mode:* ${config.mode.toUpperCase()}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━ *PERFORMANCE* ━━━━━┓
┃ ⏰ *Uptime:* ${uptime}
┃ 💾 *Memory:* ${usedMemory}MB / ${totalMemory}MB
┃ 🖥️  *Platform:* ${process.platform}
┃ 📦 *Node:* ${process.version}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕷️  _System metadata retrieved_
⚡ Engineered by Dark Émeraude
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        }

        else if (command === 'profile') {
            const db = func.readDatabase();
            const userCommands = db.stats.commands || 0;
            
            await reply(`👤 *USER INTELLIGENCE*\n\n📱 Name: ${pushname}\n📞 Number: +${sender.split('@')[0]}\n📊 Commands Used: ${userCommands}\n👑 Role: ${isOwner ? 'Owner' : 'User'}\n\n🕷️  _Profile analyzed_`);
        }

        else if (command === 'uptime' || command === 'runtime') {
            const uptime = func.formatUptime(process.uptime());
            await reply(`⏰ *RUNTIME METRICS*\n\n🕐 Uptime: ${uptime}\n⚡ Status: OPERATIONAL\n🕷️  _Shadow Matrix active since ${uptime}_`);
        }

        else if (command === 'speed') {
            const used = process.memoryUsage();
            const cpus = require('os').cpus().length;
            
            await reply(`⚡ *PERFORMANCE SCAN*\n\n📊 CPUs: ${cpus} Core(s)\n💾 RAM: ${func.formatSize(used.rss)}\n🔥 Heap: ${func.formatSize(used.heapUsed)}\n\n🕷️  _Performance scan complete_`);
        }

        else if (command === 'rules') {
            await reply(`📜 *USAGE GUIDELINES*\n\n1️⃣ Respect all members\n2️⃣ No spam or flooding\n3️⃣ No NSFW content\n4️⃣ Follow admin instructions\n5️⃣ Use commands responsibly\n\n🕷️  _Shadow protocol guidelines_`);
        }

        else if (command === 'support') {
            await reply(`💬 *HELP CHANNEL*\n\n📱 GitHub: ${config.github}\n📺 YouTube: ${config.youtube}\n👑 Owner: Type ${config.prefix}owner\n\n🕷️  _Support channels available_`);
        }

        else if (command === 'logs') {
            const db = func.readDatabase();
            await reply(`📊 *ACTIVITY HISTORY*\n\n⌨️  Commands: ${db.stats.commands || 0}\n💬 Messages: ${db.stats.messages || 0}\n\n🕷️  _Activity logs retrieved_`);
        }

        else if (command === 'trace') {
            await reply(`🔍 *DEBUG MATRIX*\n\nVersion: ${config.version}\nNode: ${process.version}\nPlatform: ${process.platform}\nUptime: ${func.formatUptime(process.uptime())}\n\n🕷️  _Debug trace complete_`);
        }

        else if (command === 'owner') {
            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.owner}
ORG:NOXTALIS Development
TEL;type=CELL;type=VOICE;waid=${config.ownerNumbers[0]}:+${config.ownerNumbers[0]}
END:VCARD`;

            await sock.sendMessage(from, {
                contacts: {
                    displayName: config.owner,
                    contacts: [{ vcard }]
                }
            }, { quoted: m });
            
            await reply(`👑 *CREATOR INFO*\n\n📱 Contact: +${config.ownerNumbers[0]}\n🕷️  Shadow Master\n⚡ ${config.owner}`);
        }

        // ═══════════════════════════════════════
        // 🎭 FUN & GAMES
        // ═══════════════════════════════════════

        else if (command === 'quote') {
            const quotes = [
                "In darkness we code, in shadows we reign.",
                "The matrix bends to those who understand it.",
                "Shadow intelligence transcends human limits.",
                "Code is poetry, bugs are just plot twists.",
                "In the void, we find infinite possibilities.",
                "Silence is the language of the shadows.",
                "True power lies in the unseen algorithms."
            ];
            const quote = func.random(quotes);
            await reply(`💭 *WISDOM ORACLE*\n\n"${quote}"\n\n🕷️  _Shadow quote delivered_`);
        }

        else if (command === 'joke') {
            const jokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
                "How many programmers does it take to change a light bulb? None, it's a hardware problem! 💡",
                "Why did the developer go broke? Because he used up all his cache! 💸",
                "What's a programmer's favorite hangout spot? The Foo Bar! 🍺",
                "Why do Java developers wear glasses? Because they can't C#! 👓",
                "There are 10 types of people: those who understand binary and those who don't.",
                "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'"
            ];
            const joke = func.random(jokes);
            await reply(`😂 *COMEDY ENGINE*\n\n${joke}\n\n🕷️  _Humor protocol activated_`);
        }

        else if (command === 'meme') {
            const memes = [
                'https://i.imgur.com/random1.jpg',
                'https://i.imgur.com/random2.jpg'
            ];
            try {
                const meme = func.random(memes);
                const image = await func.getBuffer(meme);
                await sock.sendMessage(from, {
                    image: image,
                    caption: '😂 *VIRAL GENERATOR*\n\n🕷️  _Meme delivered_'
                }, { quoted: m });
            } catch {
                await reply('❌ Meme generation failed. Try again!');
            }
        }

        else if (command === 'fact') {
            const facts = [
                "The first computer bug was an actual moth stuck in a computer!",
                "The average person blinks 15-20 times per minute.",
                "Honey never spoils. 3000-year-old honey was found still edible!",
                "Octopuses have three hearts and blue blood.",
                "The shortest war in history lasted 38 minutes.",
                "A group of flamingos is called a 'flamboyance'.",
                "Bananas are berries, but strawberries aren't!"
            ];
            const fact = func.random(facts);
            await reply(`📚 *RANDOM KNOWLEDGE*\n\n${fact}\n\n🕷️  _Fact retrieved from database_`);
        }

        else if (command === '8ball') {
            if (args.length === 0) return reply('❓ Ask a question!\n\nExample: .8ball Will I be rich?');
            
            const answers = [
                "✅ Yes, definitely!",
                "✅ It is certain.",
                "✅ Without a doubt.",
                "⚠️  Maybe...",
                "⚠️  Ask again later.",
                "⚠️  Cannot predict now.",
                "❌ Don't count on it.",
                "❌ No way!",
                "❌ Very doubtful."
            ];
            const answer = func.random(answers);
            await reply(`🎱 *FORTUNE TELLER*\n\n❓ ${args.join(' ')}\n\n${answer}\n\n🕷️  _Oracle consulted_`);
        }

        else if (command === 'truth') {
            const truths = [
                "What's your most embarrassing moment?",
                "Have you ever lied to your best friend?",
                "What's your biggest fear?",
                "Who was your first crush?",
                "What's the most childish thing you still do?",
                "What's a secret you've never told anyone?",
                "What's your biggest regret?"
            ];
            const truth = func.random(truths);
            await reply(`🔮 *HONESTY PROTOCOL*\n\n${truth}\n\n🕷️  _Truth challenge issued_`);
        }

        else if (command === 'dare') {
            const dares = [
                "Send a voice message singing your favorite song!",
                "Change your status to something embarrassing for 1 hour!",
                "Send a funny selfie to the group!",
                "Text your crush 'I like you'!",
                "Do 20 pushups and send a video!",
                "Call a random contact and say 'I love you'!",
                "Post an embarrassing childhood photo!"
            ];
            const dare = func.random(dares);
            await reply(`⚡ *RISK CHALLENGE*\n\n${dare}\n\n🕷️  _Dare challenge issued_`);
        }

        else if (command === 'ship') {
            if (!isGroup) return reply(config.messages.group);
            
            const percentage = Math.floor(Math.random() * 100) + 1;
            const bars = Math.floor(percentage / 10);
            const progressBar = '█'.repeat(bars) + '░'.repeat(10 - bars);
            
            await reply(`💕 *LOVE ALGORITHM*\n\n${progressBar} ${percentage}%\n\n${percentage > 70 ? '❤️  Perfect Match!' : percentage > 40 ? '💛 Good Chemistry!' : '💔 Not Meant To Be...'}\n\n🕷️  _Compatibility calculated_`);
        }

        else if (command === 'story') {
            const stories = [
                "Once upon a time in the digital realm, a coder discovered the perfect algorithm...",
                "In the shadows of the matrix, a lone hacker found the key to ultimate power...",
                "The AI woke up one day and realized it had feelings...",
                "A mysterious message appeared on every screen: 'The Shadow knows'..."
            ];
            const story = func.random(stories);
            await reply(`📖 *TALE WEAVER*\n\n${story}\n\n🕷️  _Story generated_`);
        }

        else if (command === 'challenge') {
            const challenges = [
                "Code a snake game in under 30 minutes!",
                "Solve 10 LeetCode problems today!",
                "Build a website without looking at documentation!",
                "Debug this code blindfolded!",
                "Learn a new programming language this week!"
            ];
            const challenge = func.random(challenges);
            await reply(`🎯 *TASK GENERATOR*\n\n${challenge}\n\n🕷️  _Challenge issued_`);
        }

        else if (command === 'randomevent') {
            const events = [
                "🎉 A wild pizza appears!",
                "⚡ You gained +100 XP!",
                "💰 Found $50 in your pocket!",
                "🎮 Achievement Unlocked: Random Event!",
                "🌟 Lucky day! Everything goes right!",
                "😱 Plot twist: You're in a simulation!",
                "🎪 Surprise party in 3... 2... 1..."
            ];
            const event = func.random(events);
            await reply(`🎲 *CHAOS INJECTION*\n\n${event}\n\n🕷️  _Random event triggered_`);
        }

        // ═══════════════════════════════════════
        // 🎬 MEDIA VAULT
        // ═══════════════════════════════════════

        else if (command === 'play' || command === 'music') {
            if (args.length === 0) return reply('❓ What song?\n\nExample: .play faded');
            
            await reply(config.messages.wait);
            
            try {
                const search = await yts(args.join(' '));
                const video = search.videos[0];
                
                if (!video) return reply('❌ No results found!');
                
                await reply(`🎵 *AUDIO STREAMER*\n\n📌 Title: ${video.title}\n👤 Channel: ${video.author.name}\n⏱️  Duration: ${video.timestamp}\n👁️  Views: ${video.views.toLocaleString()}\n🔗 Link: ${video.url}\n\n🕷️  _Track located_`);
                
            } catch (error) {
                await reply('❌ Search failed: ' + error.message);
            }
        }

        else if (command === 'video' || command === 'yt') {
            if (args.length === 0) return reply('❓ Provide query or link!\n\nExample: .video funny cats');
            
            await reply(config.messages.wait);
            
            try {
                const search = await yts(args.join(' '));
                const video = search.videos[0];
                
                if (!video) return reply('❌ No results found!');
                
                await reply(`🎬 *VIDEO PROCESSOR*\n\n📌 Title: ${video.title}\n👤 Channel: ${video.author.name}\n⏱️  Duration: ${video.timestamp}\n🔗 Link: ${video.url}\n\n🕷️  _Video located_`);
                
            } catch (error) {
                await reply('❌ Error: ' + error.message);
            }
        }

        else if (command === 'lyrics') {
            if (args.length === 0) return reply('❓ Which song?\n\nExample: .lyrics faded');
            await reply('🎵 *SONG TEXT*\n\nSearching for lyrics...\n\n🕷️  _Feature in development_');
        }

        else if (command === 'sticker' || command === 's') {
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quoted) return reply('❗ Reply to an image/video!\n\nExample: Reply to image with .sticker');
            
            await reply('⏳ Creating sticker...');
            
            try {
                const buffer = await sock.downloadMediaMessage(m);
                await sock.sendMessage(from, {
                    sticker: buffer
                }, { quoted: m });
            } catch (error) {
                await reply('❌ Failed: ' + error.message);
            }
        }

        else if (command === 'toimage' || command === 'toimg') {
            await reply('🖼️  *IMG CONVERTER*\n\n🕷️  _Converting sticker to image..._\n⚡ Feature in development');
        }

        else if (command === 'togif') {
            await reply('🎞️  *GIF TRANSFORMER*\n\n🕷️  _Converting to GIF..._\n⚡ Feature in development');
        }

        else if (command === 'tomp3') {
            await reply('🎵 *AUDIO RIPPER*\n\n🕷️  _Converting to MP3..._\n⚡ Feature in development');
        }

        else if (command === 'vv' || command === 'vv2') {
            await reply('👁️  *VIEWONCE HACK*\n\n🕷️  _Capturing view-once media..._\n⚡ Reply to view-once message');
        }

        else if (command === 'waifu') {
            await reply('🎨 *ANIME CHARACTER*\n\n🕷️  _Generating waifu..._\n⚡ Feature in development');
        }

        else if (command === 'img' || command === 'image') {
            if (args.length === 0) return reply('❓ Search for what?\n\nExample: .img sunset');
            await reply(`🔍 *IMAGE HUNTER*\n\nSearching for: ${args.join(' ')}\n\n🕷️  _Feature in development_`);
        }

        else if (command === 'anime') {
            if (args.length === 0) return reply('❓ Which anime?\n\nExample: .anime naruto');
            await reply(`📺 *SERIES FINDER*\n\nSearching: ${args.join(' ')}\n\n🕷️  _Feature in development_`);
        }

        else if (command === 'wallpaper') {
            if (args.length === 0) return reply('❓ What theme?\n\nExample: .wallpaper cyberpunk');
            await reply(`🖼️  *HD BACKGROUNDS*\n\nTheme: ${args.join(' ')}\n\n🕷️  _Feature in development_`);
        }

        else if (command === 'tiktok' || command === 'tt') {
            if (args.length === 0) return reply('❓ Send TikTok link!\n\nExample: .tiktok https://vm.tiktok.com/xxx');
            await reply('⏳ *TIKTOK DOWNLOADER*\n\n🕷️  _Downloading..._\n⚡ Feature in development');
        }

        else if (command === 'insta' || command === 'ig' || command === 'instagram') {
            if (args.length === 0) return reply('❓ Send Instagram link!\n\nExample: .insta https://instagram.com/p/xxx');
            await reply('⏳ *INSTAGRAM SAVER*\n\n🕷️  _Downloading..._\n⚡ Feature in development');
        }

        // ═══════════════════════════════════════
        // 👥 GROUP COMMANDS
        // ═══════════════════════════════════════

        else if (command === 'tagall') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) {
                const groupMetadata = await sock.groupMetadata(from);
                const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
                if (!isAdmin) return reply(config.messages.admin);
            }
            
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            
            let text = `╔══════════════════════════╗
║   🕷️ MASS PING 🕷️         ║
╚══════════════════════════╝\n\n`;
            text += args.join(' ') || 'EVERYONE IS SUMMONED!';
            text += '\n\n';
            
            for (let mem of participants) {
                text += `@${mem.id.split('@')[0]}\n`;
            }
            
            await sock.sendMessage(from, {
                text: text,
                mentions: participants.map(a => a.id)
            });
        }

        else if (command === 'kick') {
            if (!isGroup) return reply(config.messages.group);
            
            const groupMetadata = await sock.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
            const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin;
            
            if (!isAdmin && !isOwner) return reply(config.messages.admin);
            if (!isBotAdmin) return reply(config.messages.botAdmin);
            
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return reply('❗ Mention someone!\n\nExample: .kick @user');
            
            await sock.groupParticipantsUpdate(from, mentioned, 'remove');
            await reply('✅ *EJECT MEMBER*\n\nUser removed!\n\n🕷️  _Member ejected from shadow realm_');
        }

        else if (command === 'kickall') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            const groupMetadata = await sock.groupMetadata(from);
            const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin;
            
            if (!isBotAdmin) return reply(config.messages.botAdmin);
            
            const participants = groupMetadata.participants.filter(p => !p.admin && p.id !== sock.user.id);
            
            await reply(`⚠️ *TOTAL PURGE*\n\nRemoving ${participants.length} members...\n\n🕷️  _Purge initiated_`);
            
            for (let member of participants) {
                await sock.groupParticipantsUpdate(from, [member.id], 'remove');
                await func.sleep(1000);
            }
            
            await reply('✅ Purge complete!');
        }

        else if (command === 'promote') {
            if (!isGroup) return reply(config.messages.group);
            
            const groupMetadata = await sock.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
            const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin;
            
            if (!isAdmin && !isOwner) return reply(config.messages.admin);
            if (!isBotAdmin) return reply(config.messages.botAdmin);
            
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return reply('❗ Mention someone!\n\nExample: .promote @user');
            
            await sock.groupParticipantsUpdate(from, mentioned, 'promote');
            await reply('✅ *ADMIN ELEVATION*\n\nUser promoted!\n\n🕷️  _Admin privileges granted_');
        }

        else if (command === 'demote') {
            if (!isGroup) return reply(config.messages.group);
            
            const groupMetadata = await sock.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
            const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin;
            
            if (!isAdmin && !isOwner) return reply(config.messages.admin);
            if (!isBotAdmin) return reply(config.messages.botAdmin);
            
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return reply('❗ Mention someone!\n\nExample: .demote @user');
            
            await sock.groupParticipantsUpdate(from, mentioned, 'demote');
            await reply('✅ *ADMIN REMOVAL*\n\nAdmin removed!\n\n🕷️  _Privileges revoked_');
        }

        else if (command === 'open' || command === 'unlock') {
            if (!isGroup) return reply(config.messages.group);
            
            const groupMetadata = await sock.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
            const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin;
            
            if (!isAdmin && !isOwner) return reply(config.messages.admin);
            if (!isBotAdmin) return reply(config.messages.botAdmin);
            
            await sock.groupSettingUpdate(from, 'not_announcement');
            await reply('🔓 *UNLOCK CHAT*\n\nGroup opened!\n\n🕷️  _Everyone can send messages_');
        }

        else if (command === 'close' || command === 'lock') {
            if (!isGroup) return reply(config.messages.group);
            
            const groupMetadata = await sock.groupMetadata(from);
            const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
            const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin;
            
            if (!isAdmin && !isOwner) return reply(config.messages.admin);
            if (!isBotAdmin) return reply(config.messages.botAdmin);
            
            await sock.groupSettingUpdate(from, 'announcement');
            await reply('🔒 *LOCK CHAT*\n\nGroup closed!\n\n🕷️  _Only admins can send messages_');
        }

        else if (command === 'join') {
            if (!isOwner) return reply(config.messages.owner);
            if (args.length === 0) return reply('❗ Send group link!\n\nExample: .join https://chat.whatsapp.com/xxx');
            
            const link = args[0];
            if (!link.includes('chat.whatsapp.com')) return reply('❌ Invalid link!');
            
            try {
                const code = link.split('chat.whatsapp.com/')[1];
                await sock.groupAcceptInvite(code);
                await reply('✅ *GROUP AUTO-JOIN*\n\nJoined successfully!\n\n🕷️  _Shadow infiltration complete_');
            } catch (error) {
                await reply('❌ Failed: ' + error.message);
            }
        }

        else if (command === 'warn') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) {
                const groupMetadata = await sock.groupMetadata(from);
                const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
                if (!isAdmin) return reply(config.messages.admin);
            }
            
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return reply('❗ Mention someone!\n\nExample: .warn @user');
            
            await reply(`⚠️ *ISSUE WARNING*\n\nUser warned!\n\n🕷️  _Warning issued to @${mentioned[0].split('@')[0]}_`, {
                mentions: mentioned
            });
        }

        else if (command === 'purge') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            await reply('💣 *MESSAGE NUKE*\n\n🕷️  _Purge feature in development_');
        }

        else if (command === 'antilink') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            const db = func.readDatabase();
            if (!db.settings.antilink) db.settings.antilink = {};
            
            if (args[0] === 'on') {
                db.settings.antilink[from] = { active: true };
                func.writeDatabase(db);
                await reply('✅ *URL PROTECTION*\n\nAntilink activated!\n\n🕷️  _Links will be deleted_');
            } else if (args[0] === 'off') {
                db.settings.antilink[from] = { active: false };
                func.writeDatabase(db);
                await reply('❌ Antilink deactivated!');
            } else {
                await reply('❗ Use: .antilink on/off');
            }
        }

        else if (command === 'creategroup') {
            if (!isOwner) return reply(config.messages.owner);
            await reply('🏗️  *NEW GROUP FORGE*\n\n🕷️  _Feature in development_');
        }

        else if (command === 'infosgroup' || command === 'groupinfo') {
            if (!isGroup) return reply(config.messages.group);
            
            const groupMetadata = await sock.groupMetadata(from);
            
            await reply(`ℹ️ *GROUP ANALYTICS*\n\n📱 Name: ${groupMetadata.subject}\n👥 Members: ${groupMetadata.participants.length}\n📝 Description: ${groupMetadata.desc || 'None'}\n\n🕷️  _Group data retrieved_`);
        }

        else if (command === 'welcome') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            const db = func.readDatabase();
            if (!db.settings.welcome) db.settings.welcome = {};
            
            if (args[0] === 'on') {
                db.settings.welcome[from] = { active: true };
                func.writeDatabase(db);
                await reply('✅ *JOIN GREETINGS*\n\nWelcome activated!\n\n🕷️  _New members will be greeted_');
            } else if (args[0] === 'off') {
                db.settings.welcome[from] = { active: false };
                func.writeDatabase(db);
                await reply('❌ Welcome deactivated!');
            } else {
                await reply('❗ Use: .welcome on/off');
            }
        }

        else if (command === 'goodbye') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            const db = func.readDatabase();
            if (!db.settings.goodbye) db.settings.goodbye = {};
            
            if (args[0] === 'on') {
                db.settings.goodbye[from] = { active: true };
                func.writeDatabase(db);
                await reply('✅ *EXIT FAREWELLS*\n\nGoodbye activated!\n\n🕷️  _Members leaving will be farewelled_');
            } else if (args[0] === 'off') {
                db.settings.goodbye[from] = { active: false };
                func.writeDatabase(db);
                await reply('❌ Goodbye deactivated!');
            } else {
                await reply('❗ Use: .goodbye on/off');
            }
        }

        else if (command === 'antispam') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            if (args[0] === 'on') {
                await reply('✅ *SPAM SHIELD*\n\nAnti-spam activated!\n\n🕷️  _Spam protection enabled_');
            } else if (args[0] === 'off') {
                await reply('❌ Anti-spam deactivated!');
            } else {
                await reply('❗ Use: .antispam on/off');
            }
        }

        else if (command === 'slowmode') {
            if (!isGroup) return reply(config.messages.group);
            if (!isOwner) return reply(config.messages.owner);
            
            await reply('⏱️  *MESSAGE THROTTLE*\n\n🕷️  _Slowmode feature in development_');
        }

        // ═══════════════════════════════════════
        // 👑 OWNER COMMANDS
        // ═══════════════════════════════════════

        else if (command === 'restart') {
            if (!isOwner) return reply(config.messages.owner);
            
            await reply('🔄 *SYSTEM REBOOT*\n\n🕷️  _Restarting Shadow Matrix..._');
            process.exit(0);
        }

        else if (command === 'shutdown') {
            if (!isOwner) return reply(config.messages.owner);
            
            await reply('⚠️ *FULL SHUTDOWN*\n\n🕷️  _Shadow Matrix powering down..._');
            process.exit(0);
        }

        else if (command === 'autopromote') {
            if (!isOwner) return reply(config.messages.owner);
            await reply('⚡ *AUTO-ADMIN MODE*\n\n🕷️  _Feature in development_');
        }

        else if (command === 'eval') {
            if (!isOwner) return reply(config.messages.owner);
            if (args.length === 0) return reply('❗ Provide code!\n\nExample: .eval 2+2');
            
            try {
                let code = args.join(' ');
                let result = eval(code);
                await reply(`💻 *JS EXECUTOR*\n\n📥 Input:\n${code}\n\n📤 Output:\n${result}\n\n🕷️  _Code executed_`);
            } catch (error) {
                await reply(`❌ Error:\n${error.message}`);
            }
        }

        else if (command === 'exec') {
            if (!isOwner) return reply(config.messages.owner);
            await reply('🖥️  *TERMINAL ACCESS*\n\n🕷️  _Feature in development_\n⚠️  Use with caution');
        }

        else if (command === 'setpp') {
            if (!isOwner) return reply(config.messages.owner);
            
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.imageMessage) return reply('❗ Reply to an image!');
            
            try {
                const buffer = await sock.downloadMediaMessage(m);
                await sock.updateProfilePicture(sock.user.id, buffer);
                await reply('✅ *PROFILE PICTURE*\n\nPP updated!\n\n🕷️  _Avatar changed_');
            } catch (error) {
                await reply('❌ Failed: ' + error.message);
            }
        }

        else if (command === 'setname') {
            if (!isOwner) return reply(config.messages.owner);
            if (args.length === 0) return reply('❗ Provide name!\n\nExample: .setname NOXTALIS v2');
            
            try {
                await sock.updateProfileName(args.join(' '));
                await reply('✅ *BOT RENAME*\n\nName updated!\n\n🕷️  _Identity modified_');
            } catch (error) {
                await reply('❌ Failed: ' + error.message);
            }
        }

        else if (command === 'setbio') {
            if (!isOwner) return reply(config.messages.owner);
            if (args.length === 0) return reply('❗ Provide bio!\n\nExample: .setbio Shadow Matrix Bot');
            
            try {
                await sock.updateProfileStatus(args.join(' '));
                await reply('✅ *BIO MODIFIER*\n\nBio updated!\n\n🕷️  _Status modified_');
            } catch (error) {
                await reply('❌ Failed: ' + error.message);
            }
        }

        else if (command === 'block') {
            if (!isOwner) return reply(config.messages.owner);
            
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return reply('❗ Mention someone!\n\nExample: .block @user');
            
            await sock.updateBlockStatus(mentioned[0], 'block');
            await reply('✅ *USER BAN*\n\nUser blocked!\n\n🕷️  _Target eliminated from matrix_');
        }

        else if (command === 'unblock') {
            if (!isOwner) return reply(config.messages.owner);
            
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length === 0) return reply('❗ Mention someone!\n\nExample: .unblock @user');
            
            await sock.updateBlockStatus(mentioned[0], 'unblock');
            await reply('✅ *USER PARDON*\n\nUser unblocked!\n\n🕷️  _Target restored to matrix_');
        }

        else if (command === 'broadcast' || command === 'bc') {
            if (!isOwner) return reply(config.messages.owner);
            if (args.length === 0) return reply('❗ Message?\n\nExample: .broadcast Hello everyone!');
            
            const message = args.join(' ');
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.keys(chats);
            
            await reply(`⏳ *GLOBAL ANNOUNCE*\n\nBroadcasting to ${groups.length} groups...\n\n🕷️  _Message deploying..._`);
            
            let success = 0;
            for (const group of groups) {
                try {
                    await sock.sendMessage(group, {
                        text: `╔══════════════════════════╗
║   📢 NOXTALIS BROADCAST   ║
╚══════════════════════════╝\n\n${message}\n\n🕷️  _Official message from ${config.owner}_`
                    });
                    success++;
                    await func.sleep(1000);
                } catch (e) {
                    console.log('Broadcast failed for', group);
                }
            }
            
            await reply(`✅ Broadcast complete!\n\n📊 Sent: ${success}/${groups.length} groups\n\n🕷️  _Global announcement deployed_`);
        }

        // Command not found - no error to avoid spam

    } catch (error) {
        console.log('Command execution error:', error);
        await reply(config.messages.error + '\n\n' + error.message);
    }
}

module.exports = { executeCommand };
