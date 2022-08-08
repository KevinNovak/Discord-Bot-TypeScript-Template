import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class HelpCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.help'),
        description: Lang.getRef('commandDescs.help', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                name: Lang.getCom('arguments.option'),
                description: 'Option.',
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'Commands',
                        value: 'COMMANDS',
                    },
                    {
                        name: 'Permissions',
                        value: 'PERMISSIONS',
                    },
                    {
                        name: 'FAQ',
                        value: 'FAQ',
                    },
                ],
            },
        ],
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let option = intr.options.getString(Lang.getCom('arguments.option'));

        let embed: MessageEmbed;
        switch (option) {
            case 'COMMANDS': {
                embed = Lang.getEmbed('displayEmbeds.commands', data.lang());
                break;
            }
            case 'PERMISSIONS': {
                embed = Lang.getEmbed('displayEmbeds.permissions', data.lang());
                break;
            }
            case 'FAQ': {
                embed = Lang.getEmbed('displayEmbeds.faq', data.lang());
                break;
            }
            default: {
                return;
            }
        }

        await InteractionUtils.send(intr, embed);
    }
}
