import { ApplicationCommandData, CommandInteraction } from 'discord.js-light';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class SupportCommand implements Command {
    public info: ApplicationCommandData = {
        name: 'support',
        description: 'Contact support.',
    };
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.replyIntr(intr, Lang.getEmbed('displays.support', data.lang()));
    }
}
