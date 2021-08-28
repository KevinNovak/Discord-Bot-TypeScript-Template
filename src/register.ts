import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ApplicationCommandData } from 'discord.js';

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
import { Logger } from './services';

let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    let cmdDatas: ApplicationCommandData[] = [
        DevCommand.data,
        DocsCommand.data,
        HelpCommand.data,
        InfoCommand.data,
        InviteCommand.data,
        SupportCommand.data,
        TestCommand.data,
        TranslateCommand.data,
        VoteCommand.data,
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
