import { Client } from 'discord.js-light';

import { Bot } from './bot';
import { DevCommand, HelpCommand, InfoCommand, TestCommand } from './commands';
import { GuildJoinHandler, GuildLeaveHandler, MessageHandler } from './events';
import { Logger } from './services';

let Config = require('../config/config.json');

async function start(): Promise<void> {
    let client = new Client({
        // discord.js Options
        ws: { intents: Config.client.intents },
        partials: Config.client.partials,
        messageCacheMaxSize: Config.client.caches.messages.size,
        messageCacheLifetime: Config.client.caches.messages.lifetime,
        messageSweepInterval: Config.client.caches.messages.sweepInterval,

        // discord.js-light Options
        cacheGuilds: Config.client.caches.guilds,
        cacheRoles: Config.client.caches.roles,
        cacheEmojis: Config.client.caches.emojis,
        cacheChannels: Config.client.caches.channels,
        cacheOverwrites: Config.client.caches.overwrites,
        cachePresences: Config.client.caches.presences,
        disabledEvents: Config.client.disabledEvents,
    });

    // Commands
    let devCommand = new DevCommand();
    let helpCommand = new HelpCommand();
    let infoCommand = new InfoCommand();
    let testCommand = new TestCommand();

    // Events handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let messageHandler = new MessageHandler(Config.prefix, helpCommand, [
        devCommand,
        infoCommand,
        testCommand,
    ]);

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
