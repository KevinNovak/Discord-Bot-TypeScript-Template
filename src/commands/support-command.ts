import { ApplicationCommandData, CommandInteraction } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class SupportCommand implements Command {
    public static data: ApplicationCommandData = {
        name: 'support',
        description: 'Contact support.',
    };
    public name = SupportCommand.data.name;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displays.support', data.lang()));
    }
}
