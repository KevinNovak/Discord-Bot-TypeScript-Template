import { ApplicationCommandOptionType } from 'discord-api-types';
import { ApplicationCommandData, CommandInteraction, MessageEmbed } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class LinkCommand implements Command {
    public data: ApplicationCommandData = {
        name: Lang.getCom('commands.link'),
        description: Lang.getCom('commandDescs.link'),
        options: [
            {
                name: 'link',
                description: 'Link to display.',
                required: true,
                type: ApplicationCommandOptionType.String.valueOf(),
                choices: [
                    {
                        name: 'invite',
                        value: 'INVITE',
                    },
                    {
                        name: 'support',
                        value: 'SUPPORT',
                    },
                    {
                        name: 'docs',
                        value: 'DOCS',
                    },
                    {
                        name: 'vote',
                        value: 'VOTE',
                    },
                ],
            },
        ],
    };
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let link = intr.options.getString('link');

        let embed: MessageEmbed;
        switch (link) {
            case 'INVITE': {
                embed = Lang.getEmbed('displayEmbeds.invite', data.lang());
                break;
            }
            case 'SUPPORT': {
                embed = Lang.getEmbed('displayEmbeds.support', data.lang());
                break;
            }
            case 'DOCS': {
                embed = Lang.getEmbed('displayEmbeds.docs', data.lang());
                break;
            }
            case 'VOTE': {
                embed = Lang.getEmbed('displayEmbeds.vote', data.lang());
                break;
            }
            default: {
                return;
            }
        }

        await MessageUtils.sendIntr(intr, embed);
    }
}
