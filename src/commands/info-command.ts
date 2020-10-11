import djs, { DMChannel, Message, MessageEmbed, TextChannel } from 'discord.js';
import typescript from 'typescript';

import { MessageUtils } from '../utils';
import { Command } from './command';

let Config = require('../../config/config.json');
let TsConfig = require('../../tsconfig.json');

export class InfoCommand implements Command {
    public name = 'info';
    public aliases = ['i', 'information'];
    public requireGuild = false;

    public async execute(
        args: string[],
        msg: Message,
        channel: DMChannel | TextChannel
    ): Promise<void> {
        let embed = new MessageEmbed()
            .setTitle('My Bot - Info')
            .addField('Node.js', process.version)
            .addField('TypeScript', `v${typescript.version}`)
            .addField('ECMAScript', TsConfig.compilerOptions.target)
            .addField('discord.js', `v${djs.version}`)
            .setColor(Config.colors.default);

        await MessageUtils.send(channel, embed);
    }
}
