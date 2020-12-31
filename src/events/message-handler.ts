import { DMChannel, GuildMember, Message, Permissions, TextChannel } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Command } from '../commands';
import { Lang, Logger } from '../services';
import { MessageUtils, PermissionUtils } from '../utils';

let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');
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

        // Only handle messages from text or DM channels
        if (!(msg.channel instanceof TextChannel || msg.channel instanceof DMChannel)) {
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
        if (!PermissionUtils.canSendEmbed(msg.channel)) {
            // No permission to send message
            if (PermissionUtils.canSend(msg.channel)) {
                let message = Lang.getRef('missingEmbedPerms', 'en');
                await MessageUtils.send(msg.channel, message);
            }
            return;
        }

        // If only a prefix, run the help command
        if (args.length === 1) {
            await this.helpCommand.execute(msg, args);
            return;
        }

        // Try to find the command the user wants
        let command = this.findCommand(args[1]);

        // If no command found, run the help command
        if (!command) {
            await this.helpCommand.execute(msg, args);
            return;
        }

        if (command.requireGuild && !(msg.channel instanceof TextChannel)) {
            let embed = Lang.getEmbed('serverOnlyCommand', 'en');
            await MessageUtils.send(msg.channel, embed);
            return;
        }

        try {
            if (msg.channel instanceof DMChannel) {
                await command.execute(msg, args);
                return;
            }

            if (msg.channel instanceof TextChannel) {
                // Check if user has permission
                if (!this.hasPermission(msg.member, command)) {
                    let embed = Lang.getEmbed('permissionRequired', 'en');
                    await MessageUtils.send(msg.channel, embed);
                    return;
                }

                // Execute the command
                await command.execute(msg, args);
                return;
            }
        } catch (error) {
            // Try to notify sender of command error
            try {
                let embed = Lang.getEmbed('commandError', 'en', {
                    ERROR_CODE: msg.id,
                });
                await MessageUtils.send(msg.channel, embed);
            } catch {
                // Ignore
            }

            // Log command error
            if (msg.channel instanceof DMChannel) {
                Logger.error(
                    Logs.error.commandDm
                        .replace('{MESSAGE_ID}', msg.id)
                        .replace('{COMMAND_NAME}', command.name)
                        .replace('{SENDER_TAG}', msg.author.tag)
                        .replace('{SENDER_ID}', msg.author.id),
                    error
                );
            } else if (msg.channel instanceof TextChannel) {
                Logger.error(
                    Logs.error.commandGuild
                        .replace('{MESSAGE_ID}', msg.id)
                        .replace('{COMMAND_NAME}', command.name)
                        .replace('{SENDER_TAG}', msg.author.tag)
                        .replace('{SENDER_ID}', msg.author.id)
                        .replace('{CHANNEL_NAME}', msg.channel.name)
                        .replace('{CHANNEL_ID}', msg.channel.id)
                        .replace('{GUILD_NAME}', msg.guild.name)
                        .replace('{GUILD_ID}', msg.guild.id),
                    error
                );
            }
        }
    }

    private findCommand(input: string): Command {
        input = input.toLowerCase();
        return (
            this.commands.find(command => command.name === input) ??
            this.commands.find(command => command.aliases.includes(input))
        );
    }

    private hasPermission(member: GuildMember, command: Command): boolean {
        // Debug option to bypass permission checks
        if (Debug.skipCheck.perms) {
            return true;
        }

        // Members with "Manage Server" have permission for all commands
        if (member.hasPermission(Permissions.FLAGS.MANAGE_GUILD)) {
            return true;
        }

        // Check if member has required permissions for command
        if (!member.hasPermission(command.requirePerms)) {
            return false;
        }

        return true;
    }
}
