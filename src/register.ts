import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

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
    // TODO: Way to not instantiate classes, static properties?
    let devCommand = new DevCommand();
    let docsCommand = new DocsCommand();
    let helpCommand = new HelpCommand();
    let infoCommand = new InfoCommand();
    let inviteCommand = new InviteCommand();
    let supportCommand = new SupportCommand();
    let testCommand = new TestCommand();
    let translateCommand = new TranslateCommand();
    let voteCommand = new VoteCommand();

    let commands = [
        devCommand,
        docsCommand,
        helpCommand,
        infoCommand,
        inviteCommand,
        supportCommand,
        testCommand,
        translateCommand,
        voteCommand,
    ];

    let cmdInfos = commands.map(command => command.info);
    let cmdNames = cmdInfos.map(cmdInfo => cmdInfo.name);

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
        await rest.put(Routes.applicationCommands(Config.client.id), { body: cmdInfos });
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
