import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    MessageEmbed,
    PermissionString,
} from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './index.js';

export class LinkCommand implements Command {
    public metadata: ChatInputApplicationCommandData = {
        name: Lang.getCom('commands.link'),
        description: Lang.getRef('commandDescs.link', Lang.Default),
        options: [
            {
                name: Lang.getCom('arguments.link'),
                description: 'Link to display.',
                required: true,
                type: ApplicationCommandOptionType.String.valueOf(),
                choices: [
                    {
                        name: 'docs',
                        value: 'docs',
                    },
                    {
                        name: 'donate',
                        value: 'donate',
                    },
                    {
                        name: 'invite',
                        value: 'invite',
                    },
                    {
                        name: 'support',
                        value: 'support',
                    },
                    {
                        name: 'vote',
                        value: 'vote',
                    },
                ],
            },
        ],
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireGuild = false;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let link = intr.options.getString(Lang.getCom('arguments.link'));

        let embed: MessageEmbed;
        switch (link) {
            case 'docs': {
                embed = Lang.getEmbed('displayEmbeds.linkDocs', data.lang());
                break;
            }
            case 'donate': {
                embed = Lang.getEmbed('displayEmbeds.linkDonate', data.lang());
                break;
            }
            case 'invite': {
                embed = Lang.getEmbed('displayEmbeds.linkInvite', data.lang());
                break;
            }
            case 'support': {
                embed = Lang.getEmbed('displayEmbeds.linkSupport', data.lang());
                break;
            }
            case 'vote': {
                embed = Lang.getEmbed('displayEmbeds.linkVote', data.lang());
                break;
            }
            default: {
                return;
            }
        }

        await InteractionUtils.send(intr, embed);
    }
}
