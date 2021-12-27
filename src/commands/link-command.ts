import { ApplicationCommandOptionType } from 'discord-api-types';
import { ApplicationCommandData, CommandInteraction, MessageEmbed } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class LinkCommand implements Command {
    public data: ApplicationCommandData = {
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
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let link = intr.options.getString('link');

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

        await MessageUtils.sendIntr(intr, embed);
    }
}
