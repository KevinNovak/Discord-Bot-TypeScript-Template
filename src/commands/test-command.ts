import { DMChannel, Message, MessageEmbed, TextChannel } from 'discord.js';

import { MessageUtils } from '../utils';
import { Command } from './command';

let Config = require('../../config/config.json');

export class TestCommand implements Command {
    public name = 'test';
    public aliases = ['t'];
    public requireGuild = false;

    public async execute(
        args: string[],
        msg: Message,
        channel: DMChannel | TextChannel
    ): Promise<void> {
        let embed = new MessageEmbed()
            .setColor(Config.colors.default)
            .setTitle('Test Command')
            .setDescription('Test command works!');

        await MessageUtils.send(channel, embed);
    }
}
