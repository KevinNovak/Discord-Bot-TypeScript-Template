import { Client } from 'discord.js';

import { Bot } from './bot';
import { HelpCommand, TestCommand } from './commands';
import { GuildJoinHandler, GuildLeaveHandler, MessageHandler } from './events';
import { Logger } from './services';

let Config = require('../config/config.json');

async function start(): Promise<void> {
    let client = new Client({
        ws: { intents: Config.client.intents },
        partials: Config.client.partials,
        messageCacheMaxSize: Config.client.caches.messages.size,
        messageCacheLifetime: Config.client.caches.messages.lifetime,
        messageSweepInterval: Config.client.caches.messages.sweepInterval,
    });

    // Commands
    let helpCommand = new HelpCommand();
    let testCommand = new TestCommand();

    // Events handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let messageHandler = new MessageHandler(Config.prefix, helpCommand, [testCommand]);

    let bot = new Bot(
        Config.client.token,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
        []
    );

    await bot.start();
}

process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled promise rejection.', reason);
});

start();
