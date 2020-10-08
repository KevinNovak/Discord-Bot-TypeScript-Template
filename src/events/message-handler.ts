import { DMChannel, Message, MessageEmbed, TextChannel } from 'discord.js';

import { Command } from '../commands';
import { MessageUtils, PermissionUtils } from '../utils';

let Config = require('../../config/config.json');

export class MessageHandler {
    constructor(
        private prefix: string,
        private helpCommand: Command,
        private commands: Command[]
    ) {}

    public async process(msg: Message): Promise<void> {
        // Check if the message is a partial
        if (msg.partial) {
            return;
        }

        let channel = msg.channel;

        // Only handle messages from text or DM channels
        if (!(channel instanceof TextChannel || channel instanceof DMChannel)) {
            return;
        }

        // Don't respond to bots
        if (msg.author.bot) {
            return;
        }

        // Check if first argument is prefix
        let args = msg.content.split(' ');
        if (args[0].toLowerCase() !== this.prefix) {
            return;
        }

        // Check if I have permission to send a message
        if (channel instanceof TextChannel && !PermissionUtils.canSendEmbed(channel)) {
            // No permission to send message
            if (PermissionUtils.canSend(channel)) {
                let message = `I don't have all permissions required to send messages here!\n\nPlease allow me to **Read Messages**, **Send Messages**, and **Embed Links** in this channel.`;
                await MessageUtils.send(channel, message);
            }
            return;
        }

        // If only a prefix, run the help command
        if (args.length === 1) {
            await this.helpCommand.execute(args, msg, channel);
            return;
        }

        // Try to find the command the user wants
        let userCommand = args[1];
        let command = this.findCommand(userCommand);

        // If no command found, run the help command
        if (!command) {
            await this.helpCommand.execute(args, msg, channel);
            return;
        }

        if (command.requireGuild && !(channel instanceof TextChannel)) {
            let embed = new MessageEmbed()
                .setTitle('Server Only Command!')
                .setDescription(`This command can only be used in a server.`)
                .setFooter('Please try again in a server!')
                .setColor(Config.colors.error);
            await MessageUtils.send(channel, embed);
            return;
        }

        await command.execute(args, msg, channel);
    }

    private findCommand(userCommand: string): Command {
        userCommand = userCommand.toLowerCase();
        for (let command of this.commands) {
            if (command.name === userCommand) {
                return command;
            }

            if (command.aliases.includes(userCommand)) {
                return command;
            }
        }
    }
}
