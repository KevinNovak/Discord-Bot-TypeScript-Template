import { Message } from 'discord.js';

import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class HelpCommand implements Command {
    public name = 'help';
    public aliases = ['?'];
    public requireGuild = false;
    public requirePerms = [];

    public async execute(msg: Message, args: string[]): Promise<void> {
        await MessageUtils.send(msg.channel, Lang.getEmbed('help', 'en'));
    }
}
