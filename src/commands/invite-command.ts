import { ApplicationCommandData, CommandInteraction } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class InviteCommand implements Command {
    public static data: ApplicationCommandData = {
        name: Lang.getRef('commands.invite', Lang.Default),
        description: 'Invite bot.',
    };
    public name = InviteCommand.data.name;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displays.invite', data.lang()));
    }
}
