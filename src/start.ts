import { Client } from 'discord.js';
import { Bot } from './bot';
import { MessageHandler } from './events/message-handler';

let Config = require('../config/config.json');

async function start(): Promise<void> {
    let client = new Client();
    let messageHandler = new MessageHandler(Config.prefix);
    let bot = new Bot(Config.token, client, messageHandler);
    await bot.start();
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', promise);
    if (reason instanceof Error) {
        console.error(reason.stack);
    } else {
        console.error(reason);
    }
});

start();
