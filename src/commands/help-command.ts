import { DMChannel, Message, TextChannel } from 'discord.js';
import { Lang } from '../services';

import { MessageUtils } from '../utils';
import { Command } from './command';

export class HelpCommand implements Command {
    public name = 'help';
    public aliases = ['?'];
    public requireGuild = false;

    public async execute(
        args: string[],
        msg: Message,
        channel: DMChannel | TextChannel
    ): Promise<void> {
        let embed = Lang.getEmbed('help', 'en');
        await MessageUtils.send(channel, embed);
    }
}
