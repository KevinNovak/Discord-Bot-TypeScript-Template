import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { HelpOption } from '../../enums/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class HelpCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.help', Lang.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.help'),
        description: Lang.getRef('commandDescs.help', Lang.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.help'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                name: Lang.getRef('arguments.option', Lang.Default),
                name_localizations: Lang.getRefLocalizationMap('arguments.option'),
                description: Lang.getRef('argDescs.helpOption', Lang.Default),
                description_localizations: Lang.getRefLocalizationMap('argDescs.helpOption'),
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: Lang.getRef('helpOptions.commands', Lang.Default),
                        name_localizations: Lang.getRefLocalizationMap('helpOptions.commands'),
                        value: HelpOption.COMMANDS,
                    },
                    {
                        name: Lang.getRef('helpOptions.permissions', Lang.Default),
                        name_localizations: Lang.getRefLocalizationMap('helpOptions.permissions'),
                        value: HelpOption.PERMISSIONS,
                    },
                    {
                        name: Lang.getRef('helpOptions.faq', Lang.Default),
                        name_localizations: Lang.getRefLocalizationMap('helpOptions.faq'),
                        value: HelpOption.FAQ,
                    },
                ],
            },
        ],
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let option = intr.options.getString(Lang.getRef('arguments.option', Lang.Default));

        let embed: MessageEmbed;
        switch (option) {
            case HelpOption.COMMANDS: {
                embed = Lang.getEmbed('displayEmbeds.commands', data.lang());
                break;
            }
            case HelpOption.PERMISSIONS: {
                embed = Lang.getEmbed('displayEmbeds.permissions', data.lang());
                break;
            }
            case HelpOption.FAQ: {
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
