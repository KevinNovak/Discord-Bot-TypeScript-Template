import { ApplicationCommandData, CommandInteraction } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class VoteCommand implements Command {
    public static data: ApplicationCommandData = {
        name: Lang.getRef('commands.vote', Lang.Default),
        description: 'Vote for bot.',
    };
    public name = VoteCommand.data.name;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displays.vote', data.lang()));
    }
}
