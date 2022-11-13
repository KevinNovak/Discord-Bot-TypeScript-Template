import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';

import { HelpOption } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { ClientUtils, FormatUtils, InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class HelpCommand implements Command {
    public names = [Lang.getRef('chatCommands.help', Language.Default)];
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option: intr.options.getString(
                Lang.getRef('arguments.option', Language.Default)
            ) as HelpOption,
        };

        let embed: EmbedBuilder;
        switch (args.option) {
            case HelpOption.COMMANDS: {
                embed = Lang.getEmbed('displayEmbeds.commands', data.lang, {
                    CMD_LINK_TEST: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.test', Language.Default)
                        )
                    ),
                    CMD_LINK_INFO: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.info', Language.Default)
                        )
                    ),
                });
                break;
            }
            case HelpOption.PERMISSIONS: {
                embed = Lang.getEmbed('displayEmbeds.permissions', data.lang);
                break;
            }
            case HelpOption.FAQ: {
                embed = Lang.getEmbed('displayEmbeds.faq', data.lang, {
                    CMD_LINK_HELP: FormatUtils.commandMention(
                        await ClientUtils.findAppCommand(
                            intr.client,
                            Lang.getRef('chatCommands.help', Language.Default)
                        )
                    ),
                });
                break;
            }
            default: {
                return;
            }
        }

        await InteractionUtils.send(intr, embed);
    }
}
