import { ApplicationCommandData, CommandInteraction } from 'discord.js-light';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class DocsCommand implements Command {
    public info: ApplicationCommandData = {
        name: 'docs',
        description: 'Show bot documentation.',
    };
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.replyIntr(intr, Lang.getEmbed('displays.docs', data.lang()));
    }
}
