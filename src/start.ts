import { Client } from 'discord.js';

import { Bot } from './bot';
import { GuildJoinHandler, GuildLeaveHandler, MessageHandler } from './events';
import { Logger } from './services';

let Config = require('../config/config.json');

async function start(): Promise<void> {
    let client = new Client({ ws: { intents: Config.client.intents } });

    // Events handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let messageHandler = new MessageHandler(Config.prefix);

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
