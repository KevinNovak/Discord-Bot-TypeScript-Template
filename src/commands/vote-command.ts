import { ApplicationCommandData, CommandInteraction } from 'discord.js-light';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class VoteCommand implements Command {
    public info: ApplicationCommandData = {
        name: Lang.getRef('commands.vote', Lang.Default),
        description: 'Vote for bot.',
    };
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displays.vote', data.lang()));
    }
}
