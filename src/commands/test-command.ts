import { DMChannel, Message, TextChannel } from 'discord.js';
import { Lang } from '../services';

import { MessageUtils } from '../utils';
import { Command } from './command';

export class TestCommand implements Command {
    public name = 'test';
    public aliases = ['t'];
    public requireGuild = false;

    public async execute(
        args: string[],
        msg: Message,
        channel: DMChannel | TextChannel
    ): Promise<void> {
        let embed = Lang.getEmbed('test', 'en');
        await MessageUtils.send(channel, embed);
    }
}
