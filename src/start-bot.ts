import { REST } from '@discordjs/rest';
import {
    RESTGetAPIApplicationCommandsResult,
    RESTPatchAPIApplicationCommandJSONBody,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord-api-types/v10';
import { Options } from 'discord.js';
import { createRequire } from 'node:module';

import { Button } from './buttons/index.js';
import {
    Command,
    DevCommand,
    HelpCommand,
    InfoCommand,
    LinkCommand,
    TestCommand,
    TranslateCommand,
} from './commands/index.js';
import {
    ButtonHandler,
    CommandHandler,
    GuildJoinHandler,
    GuildLeaveHandler,
    MessageHandler,
    ReactionHandler,
    TriggerHandler,
} from './events/index.js';
import { CustomClient } from './extensions/index.js';
import { Job } from './jobs/index.js';
import { Bot } from './models/bot.js';
import { Reaction } from './reactions/index.js';
import { JobService, Logger } from './services/index.js';
import { Trigger } from './triggers/index.js';

const require = createRequire(import.meta.url);
let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    // Client
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
    let commands: Command[] = [
        new DevCommand(),
        new HelpCommand(),
        new InfoCommand(),
        new LinkCommand(),
        new TestCommand(),
        new TranslateCommand(),
        // TODO: Add new commands here
    ].sort((a, b) => (a.metadata.name > b.metadata.name ? 1 : -1));

    // Buttons
    let buttons: Button[] = [
        // TODO: Add new buttons here
    ];

    // Reactions
    let reactions: Reaction[] = [
        // TODO: Add new reactions here
    ];

    // Triggers
    let triggers: Trigger[] = [
        // TODO: Add new triggers here
    ];

    // Event handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let commandHandler = new CommandHandler(commands);
    let buttonHandler = new ButtonHandler(buttons);
    let triggerHandler = new TriggerHandler(triggers);
    let messageHandler = new MessageHandler(triggerHandler);
    let reactionHandler = new ReactionHandler(reactions);

    // Jobs
    let jobs: Job[] = [
        // TODO: Add new jobs here
    ];

    // Bot
    let bot = new Bot(
        Config.client.token,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
        commandHandler,
        buttonHandler,
        reactionHandler,
        new JobService(jobs)
    );

    // Register
    if (process.argv[2] == 'commands') {
        try {
            let localCmds = commands.map(cmd => cmd.metadata);
            await runCommands(localCmds, process.argv);
        } catch (error) {
            // TODO: Create log for this, cleanup old logs
            Logger.error('An error occurred while running a commands action.', error);
        }
        process.exit();
    }

    await bot.start();
}

async function runCommands(
    localCmds: RESTPostAPIChatInputApplicationCommandsJSONBody[],
    args: string[]
): Promise<void> {
    let rest = new REST({ version: '10' }).setToken(Config.client.token);
    let remoteCmds = (await rest.get(
        Routes.applicationCommands(Config.client.id)
    )) as RESTGetAPIApplicationCommandsResult;

    let localCmdsOnRemote = localCmds.filter(localCmd =>
        remoteCmds.some(remoteCmd => remoteCmd.name === localCmd.name)
    );
    let localCmdsOnly = localCmds.filter(
        localCmd => !remoteCmds.some(remoteCmd => remoteCmd.name === localCmd.name)
    );
    let remoteCmdsOnly = remoteCmds.filter(
        remoteCmd => !localCmds.some(localCmd => localCmd.name === remoteCmd.name)
    );

    switch (args[3]) {
        case 'view': {
            let localCmdsOnRemoteLine =
                localCmdsOnRemote.length > 0
                    ? localCmdsOnRemote.map(localCmd => `'${localCmd.name}'`).join(', ')
                    : 'N/A';
            let localCmdsOnlyLine =
                localCmdsOnly.length > 0
                    ? localCmdsOnly.map(localCmd => `'${localCmd.name}'`).join(', ')
                    : 'N/A';
            let remoteCmdsOnlyLine =
                remoteCmdsOnly.length > 0
                    ? remoteCmdsOnly.map(remoteCmd => `'${remoteCmd.name}'`).join(', ')
                    : 'N/A';
            Logger.info(
                `Local and remote (Run "register" to update): ${localCmdsOnRemoteLine}\nLocal only (Run "register" to create): ${localCmdsOnlyLine}\nRemote only (Run "delete" to delete): ${remoteCmdsOnlyLine}`
            );
            return;
        }
        case 'register': {
            if (localCmdsOnly.length > 0) {
                Logger.info(
                    `Creating commands: ${localCmdsOnly
                        .map(localCmd => `'${localCmd.name}'`)
                        .join(', ')}`
                );
                for (let localCmd of localCmdsOnly) {
                    await rest.post(Routes.applicationCommands(Config.client.id), {
                        body: localCmd,
                    });
                }
                Logger.info('Commands created.');
            }

            if (localCmdsOnRemote.length > 0) {
                Logger.info(
                    `Updating commands: ${localCmdsOnRemote
                        .map(localCmd => `'${localCmd.name}'`)
                        .join(', ')}`
                );
                for (let localCmd of localCmdsOnRemote) {
                    await rest.post(Routes.applicationCommands(Config.client.id), {
                        body: localCmd,
                    });
                }
                Logger.info('Commands updated.');
            }

            return;
        }
        case 'rename': {
            let oldName = args[4];
            let newName = args[5];
            if (!(oldName && newName)) {
                Logger.error('Please supply the current command name and new command name.');
                return;
            }

            let remoteCmd = remoteCmds.find(remoteCmd => remoteCmd.name == oldName);
            if (!remoteCmd) {
                Logger.error(`Could not find a command with the name '${oldName}'.`);
                return;
            }

            Logger.info(`Renaming command '${remoteCmd.name}' to '${newName}'.`);
            let body: RESTPatchAPIApplicationCommandJSONBody = {
                name: newName,
            };
            await rest.patch(Routes.applicationCommand(Config.client.id, remoteCmd.id), {
                body,
            });
            Logger.info('Command renamed.');
            return;
        }
        case 'delete': {
            let name = args[4];
            if (!name) {
                Logger.error('Please supply a command name to delete.');
                return;
            }

            let remoteCmd = remoteCmds.find(remoteCmd => remoteCmd.name == name);
            if (!remoteCmd) {
                Logger.error(`Could not find a command with the name '${name}'.`);
                return;
            }

            Logger.info(`Deleting command '${remoteCmd.name}'.`);
            await rest.delete(Routes.applicationCommand(Config.client.id, remoteCmd.id));
            Logger.info('Command deleted.');
            return;
        }
        case 'clear': {
            Logger.info(
                `Deleting commands: ${remoteCmds
                    .map(remoteCmd => `'${remoteCmd.name}'`)
                    .join(', ')}`
            );
            await rest.put(Routes.applicationCommands(Config.client.id), { body: [] });
            Logger.info(`Commands deleted.`);
            return;
        }
    }
}

process.on('unhandledRejection', (reason, _promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
