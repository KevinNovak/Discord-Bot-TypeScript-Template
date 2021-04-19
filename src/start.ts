import { Bot } from './bot';
import {
    DevCommand,
    DocsCommand,
    HelpCommand,
    InfoCommand,
    InviteCommand,
    SupportCommand,
    TestCommand,
    TranslateCommand,
    VoteCommand,
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
    let docsCommand = new DocsCommand();
    let helpCommand = new HelpCommand();
    let infoCommand = new InfoCommand();
    let inviteCommand = new InviteCommand();
    let supportCommand = new SupportCommand();
    let testCommand = new TestCommand();
    let translateCommand = new TranslateCommand();
    let voteCommand = new VoteCommand();

    // Event handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let commandHandler = new CommandHandler(Config.prefix, helpCommand, [
        devCommand,
        docsCommand,
        infoCommand,
        inviteCommand,
        supportCommand,
        testCommand,
        translateCommand,
        voteCommand,
    ]);
    let triggerHandler = new TriggerHandler([]);
    let messageHandler = new MessageHandler(commandHandler, triggerHandler);
    let reactionHandler = new ReactionHandler([]);

    let bot = new Bot(
        Config.client.token,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
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
