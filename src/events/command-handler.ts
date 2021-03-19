import { DMChannel, GuildMember, Message, Permissions, TextChannel } from 'discord.js-light';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Command } from '../commands';
import { LangCode } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang, Logger } from '../services';
import { MessageUtils, PermissionUtils } from '../utils';

let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');
let Logs = require('../../lang/logs.json');

export class CommandHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.amount,
        Config.rateLimiting.commands.interval * 1000
    );

    constructor(
        private prefix: string,
        private helpCommand: Command,
        private commands: Command[]
    ) {}

    public shouldHandle(msg: Message, args: string[]): boolean {
        return (
            [this.prefix, `<@${msg.client.user.id}>`, `<@!${msg.client.user.id}>`].includes(
                args[0].toLowerCase()
            ) && !msg.author.bot
        );
    }

    public async process(msg: Message, args: string[]): Promise<void> {
        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
            return;
        }

        // TODO: Get data from database
        let data = new EventData();

        // Check if I have permission to send a message
        if (!PermissionUtils.canSendEmbed(msg.channel)) {
            // No permission to send message
            if (PermissionUtils.canSend(msg.channel)) {
                let message = Lang.getRef('messages.missingEmbedPerms', data.lang());
                await MessageUtils.send(msg.channel, message);
            }
            return;
        }

        // If only a prefix, run the help command
        if (args.length === 1) {
            await this.helpCommand.execute(msg, args, data);
            return;
        }

        // Try to find the command the user wants
        let command = this.find(args[1], data.lang());

        // If no command found, run the help command
        if (!command) {
            await this.helpCommand.execute(msg, args, data);
            return;
        }

        if (command.requireGuild && !(msg.channel instanceof TextChannel)) {
            await MessageUtils.send(
                msg.channel,
                Lang.getEmbed('validation.serverOnlyCommand', data.lang())
            );
            return;
        }

        try {
            if (msg.channel instanceof DMChannel) {
                await command.execute(msg, args, data);
                return;
            }

            if (msg.channel instanceof TextChannel) {
                // Check if user has permission
                if (!this.hasPermission(msg.member, command)) {
                    await MessageUtils.send(
                        msg.channel,
                        Lang.getEmbed('validation.permissionRequired', data.lang())
                    );
                    return;
                }

                // Execute the command
                await command.execute(msg, args, data);
                return;
            }
        } catch (error) {
            // Try to notify sender of command error
            try {
                await MessageUtils.send(
                    msg.channel,
                    Lang.getEmbed('errors.commandError', data.lang(), {
                        ERROR_CODE: msg.id,
                    })
                );
            } catch {
                // Ignore
            }

            // Log command error
            if (msg.channel instanceof DMChannel) {
                Logger.error(
                    Logs.error.commandDm
                        .replace('{MESSAGE_ID}', msg.id)
                        .replace('{COMMAND_KEYWORD}', command.keyword(Lang.Default))
                        .replace('{SENDER_TAG}', msg.author.tag)
                        .replace('{SENDER_ID}', msg.author.id),
                    error
                );
            } else if (msg.channel instanceof TextChannel) {
                Logger.error(
                    Logs.error.commandGuild
                        .replace('{MESSAGE_ID}', msg.id)
                        .replace('{COMMAND_KEYWORD}', command.keyword(Lang.Default))
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

    private find(input: string, langCode: LangCode): Command {
        return this.commands.find(command => command.regex(langCode).test(input));
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
