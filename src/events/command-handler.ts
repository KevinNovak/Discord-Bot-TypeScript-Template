import {
    CommandInteraction,
    DMChannel,
    GuildMember,
    Permissions,
    TextChannel,
} from 'discord.js-light';
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

    constructor(public commands: Command[]) {}

    public async process(intr: CommandInteraction): Promise<void> {
        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Defer interaction
        await intr.defer();

        // TODO: Get data from database
        let data = new EventData();

        // Check if I have permission to send a message
        // TODO: Temp fix until we can have a DM channel in the interaction
        let channel = await intr.client.channels.fetch(intr.channelID);
        if (!PermissionUtils.canSendEmbed(channel)) {
            // No permission to send message
            if (PermissionUtils.canSend(channel)) {
                let message = Lang.getRef('messages.missingEmbedPerms', data.lang());
                await MessageUtils.sendIntr(intr, message);
            }
            return;
        }

        // Try to find the command the user wants
        let command = this.find(intr.commandName, data.lang());

        // If no command found, run the help command

        // TODO: What if no command found
        // if (!command) {
        //     await this.helpCommand.execute(msg, args, data);
        //     return;
        // }

        if (command.requireGuild && !(channel instanceof TextChannel)) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validation.serverOnlyCommand', data.lang())
            );
            return;
        }

        try {
            if (channel instanceof DMChannel) {
                await command.execute(intr, data);
                return;
            }

            if (channel instanceof TextChannel) {
                // Check if user has permission
                if (!this.hasPermission(intr.member, command)) {
                    await MessageUtils.sendIntr(
                        intr,
                        Lang.getEmbed('validation.permissionRequired', data.lang())
                    );
                    return;
                }

                // Execute the command
                await command.execute(intr, data);
                return;
            }
        } catch (error) {
            // Try to notify sender of command error
            try {
                await MessageUtils.sendIntr(
                    intr,
                    Lang.getEmbed('errors.commandError', data.lang(), {
                        ERROR_CODE: intr.id,
                    })
                );
            } catch {
                // Ignore
            }

            // Log command error
            if (channel instanceof DMChannel) {
                Logger.error(
                    Logs.error.commandDm
                        .replace('{MESSAGE_ID}', intr.id)
                        .replace('{COMMAND_KEYWORD}', command.info.name)
                        .replace('{SENDER_TAG}', intr.user.tag)
                        .replace('{SENDER_ID}', intr.user.id),
                    error
                );
            } else if (channel instanceof TextChannel) {
                Logger.error(
                    Logs.error.commandGuild
                        .replace('{MESSAGE_ID}', intr.id)
                        .replace('{COMMAND_KEYWORD}', command.info.name)
                        .replace('{SENDER_TAG}', intr.user.tag)
                        .replace('{SENDER_ID}', intr.user.id)
                        .replace('{CHANNEL_NAME}', channel.name)
                        .replace('{CHANNEL_ID}', channel.id)
                        .replace('{GUILD_NAME}', intr.guild.name)
                        .replace('{GUILD_ID}', intr.guild.id),
                    error
                );
            }
        }
    }

    private find(input: string, langCode: LangCode): Command {
        return this.commands.find(command => command.info.name === input);
    }

    private hasPermission(member: GuildMember, command: Command): boolean {
        // Debug option to bypass permission checks
        if (Debug.skip.checkPerms) {
            return true;
        }

        // Members with "Manage Server" have permission for all commands
        if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return true;
        }

        // Check if member has required permissions for command
        if (!member.permissions.has(command.requirePerms)) {
            return false;
        }

        return true;
    }
}
