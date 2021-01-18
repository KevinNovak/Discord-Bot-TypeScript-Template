import { Message } from 'discord.js';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class HelpCommand implements Command {
    public name = 'help';
    public aliases = ['?'];
    public requireGuild = false;
    public requirePerms = [];

    public async execute(msg: Message, args: string[], data: EventData): Promise<void> {
        await MessageUtils.send(msg.channel, Lang.getEmbed('commands.help', data.lang));
    }
}
