import { DMChannel, Message, TextChannel } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Command } from '../commands';
import { Lang, Logger } from '../services';
import { MessageUtils, PermissionUtils } from '../utils';

let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class MessageHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.amount,
        Config.rateLimiting.commands.interval * 1000
    );

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

        // Check if first argument is prefix or bot mention
        let args = msg.content.split(' ');
        if (
            ![this.prefix, `<@${msg.client.user.id}>`, `<@!${msg.client.user.id}>`].includes(
                args[0].toLowerCase()
            )
        ) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
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
            let embed = Lang.getEmbed('serverOnly', 'en');
            await MessageUtils.send(channel, embed);
            return;
        }

        try {
            await command.execute(args, msg, channel);
        } catch (error) {
            // Try to notify sender of command error
            try {
                let embed = Lang.getEmbed('commandError', 'en', {
                    ERROR_CODE: msg.id,
                });
                await MessageUtils.send(channel, embed);
            } catch {
                // Ignore
            }

            // Log command error
            if (channel instanceof DMChannel) {
                Logger.error(
                    Logs.error.commandDm
                        .replace('{MESSAGE_ID}', msg.id)
                        .replace('{COMMAND_NAME}', command.name)
                        .replace('{SENDER_TAG}', msg.author.tag)
                        .replace('{SENDER_ID}', msg.author.id),
                    error
                );
            } else if (channel instanceof TextChannel) {
                Logger.error(
                    Logs.error.commandGuild
                        .replace('{MESSAGE_ID}', msg.id)
                        .replace('{COMMAND_NAME}', command.name)
                        .replace('{SENDER_TAG}', msg.author.tag)
                        .replace('{SENDER_ID}', msg.author.id)
                        .replace('{CHANNEL_NAME}', channel.name)
                        .replace('{CHANNEL_ID}', channel.id)
                        .replace('{GUILD_NAME}', msg.guild.name)
                        .replace('{GUILD_ID}', msg.guild.id),
                    error
                );
            }
        }
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
