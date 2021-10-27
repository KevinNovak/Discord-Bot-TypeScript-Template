import { ApplicationCommandData, CommandInteraction } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class InfoCommand implements Command {
    public data: ApplicationCommandData = {
        name: Lang.getCom('commands.info'),
        description: Lang.getRef('commandDescs.info', Lang.Default),
    };
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displayEmbeds.info', data.lang()));
    }
}
