import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ApplicationCommandData } from 'discord.js';

import {
    DevCommand,
    HelpCommand,
    InfoCommand,
    LinkCommand,
    TestCommand,
    TranslateCommand,
} from './commands';
import { Logger } from './services';

let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    let cmdDatas: ApplicationCommandData[] = [
        // Commands
        HelpCommand.data,
        InfoCommand.data,
        LinkCommand.data,
        TestCommand.data,
        TranslateCommand.data,

        // Developer Commands
        DevCommand.data,
    ];

    let cmdNames = cmdDatas.map(cmdInfo => cmdInfo.name);

    Logger.info(
        Logs.info.commandsRegistering.replaceAll(
            '{COMMAND_NAMES}',
            cmdNames
                .map(cmdName => `'${cmdName}'`)
                .sort()
                .join(', ')
        )
    );

    try {
        let rest = new REST({ version: '9' }).setToken(Config.client.token);

        // Remove old commands
        await rest.put(Routes.applicationCommands(Config.client.id), { body: [] });

        // Register new commands
        await rest.put(Routes.applicationCommands(Config.client.id), { body: cmdDatas });
    } catch (error) {
        Logger.error(Logs.error.commandsRegistering, error);
    }

    Logger.info(Logs.info.commandsRegistered);
}

process.on('unhandledRejection', (reason, promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
