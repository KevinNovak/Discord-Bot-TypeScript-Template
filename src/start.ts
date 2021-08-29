import { Options } from 'discord.js';

import { Bot } from './bot';
import {
    DevCommand,
    HelpCommand,
    InfoCommand,
    LinkCommand,
    TestCommand,
    TranslateCommand,
} from './commands';
import {
    CommandHandler,
    GuildJoinHandler,
    GuildLeaveHandler,
    MessageHandler,
    ReactionHandler,
    TriggerHandler,
} from './events';
import { CustomClient } from './extensions';
import { JobService, Logger } from './services';

let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    let client = new CustomClient({
        intents: Config.client.intents,
        partials: Config.client.partials,
        makeCache: Options.cacheWithLimits({
            // Keep default caching behavior
            ...Options.defaultMakeCacheSettings,
            // Override specific options from config
            ...Config.client.caches,
        }),
    });

    // Commands
    let devCommand = new DevCommand();
    let helpCommand = new HelpCommand();
    let infoCommand = new InfoCommand();
    let linkCommand = new LinkCommand();
    let testCommand = new TestCommand();
    let translateCommand = new TranslateCommand();

    // Event handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let commandHandler = new CommandHandler([
        devCommand,
        helpCommand,
        infoCommand,
        linkCommand,
        testCommand,
        translateCommand,
    ]);
    let triggerHandler = new TriggerHandler([]);
    let messageHandler = new MessageHandler(triggerHandler);
    let reactionHandler = new ReactionHandler([]);

    let bot = new Bot(
        Config.client.token,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
        commandHandler,
        reactionHandler,
        new JobService([])
    );

    await bot.start();
}

process.on('unhandledRejection', (reason, promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
