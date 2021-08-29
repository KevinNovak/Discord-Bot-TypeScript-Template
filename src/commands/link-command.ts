import { ApplicationCommandOptionType } from 'discord-api-types';
import { ApplicationCommandData, CommandInteraction, MessageEmbed } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class LinkCommand implements Command {
    public static data: ApplicationCommandData = {
        name: 'link',
        description: 'Get links to invite, support, etc.',
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
    public name = LinkCommand.data.name;
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let link = intr.options.getString('link');

        let embed: MessageEmbed;
        switch (link) {
            case 'INVITE': {
                embed = Lang.getEmbed('displays.invite', data.lang());
                break;
            }
            case 'SUPPORT': {
                embed = Lang.getEmbed('displays.support', data.lang());
                break;
            }
            case 'DOCS': {
                embed = Lang.getEmbed('displays.docs', data.lang());
                break;
            }
            case 'VOTE': {
                embed = Lang.getEmbed('displays.vote', data.lang());
                break;
            }
            default: {
                return;
            }
        }

        await MessageUtils.sendIntr(intr, embed);
    }
}
