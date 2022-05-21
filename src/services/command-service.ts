import { REST } from '@discordjs/rest';
import {
    RESTGetAPIApplicationCommandsResult,
    RESTPatchAPIApplicationCommandJSONBody,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord-api-types/v10';
import { createRequire } from 'node:module';

import { Logger } from './logger.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class CommandService {
    constructor(private rest: REST) {}

    public async runCommands(
        localCmds: RESTPostAPIChatInputApplicationCommandsJSONBody[],
        args: string[]
    ): Promise<void> {
        let remoteCmds = (await this.rest.get(
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
                        await this.rest.post(Routes.applicationCommands(Config.client.id), {
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
                        await this.rest.post(Routes.applicationCommands(Config.client.id), {
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
                await this.rest.patch(Routes.applicationCommand(Config.client.id, remoteCmd.id), {
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
                await this.rest.delete(Routes.applicationCommand(Config.client.id, remoteCmd.id));
                Logger.info('Command deleted.');
                return;
            }
            case 'clear': {
                Logger.info(
                    `Deleting commands: ${remoteCmds
                        .map(remoteCmd => `'${remoteCmd.name}'`)
                        .join(', ')}`
                );
                await this.rest.put(Routes.applicationCommands(Config.client.id), { body: [] });
                Logger.info(`Commands deleted.`);
                return;
            }
        }
    }
}
