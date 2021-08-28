import { ApplicationCommandData, CommandInteraction } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class DocsCommand implements Command {
    public static data: ApplicationCommandData = {
        name: 'docs',
        description: 'Show bot documentation.',
    };
    public name = DocsCommand.data.name;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displays.docs', data.lang()));
    }
}
