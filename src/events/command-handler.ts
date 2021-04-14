import {
    CommandInteraction,
    GuildMember,
    NewsChannel,
    Permissions,
    TextChannel,
} from 'discord.js-light';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventHandler } from '.';
import { Command } from '../commands';
import { EventData } from '../models/internal-models';
import { Lang, Logger } from '../services';
import { MessageUtils, PermissionUtils } from '../utils';

let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');
let Logs = require('../../lang/logs.json');

export class CommandHandler implements EventHandler {
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
        // NOTE: Anything after this point we should be responding to the interaction
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
        let command = this.commands.find(command => command.info.name === intr.commandName);
        if (!command) {
            // TODO: Reply to interaction
            return;
        }

        if (command.requireGuild && !intr.guild) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validation.serverOnlyCommand', data.lang())
            );
            return;
        }

        if (intr.member && !this.hasPermission(intr.member, command)) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validation.permissionRequired', data.lang())
            );
            return;
        }

        // Execute the command
        try {
            await command.execute(intr, data);
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
            Logger.error(
                intr.channel instanceof TextChannel || intr.channel instanceof NewsChannel
                    ? Logs.error.commandGuild
                          .replace('{MESSAGE_ID}', intr.id)
                          .replace('{COMMAND_KEYWORD}', command.info.name)
                          .replace('{SENDER_TAG}', intr.user.tag)
                          .replace('{SENDER_ID}', intr.user.id)
                          .replace('{CHANNEL_NAME}', intr.channel.name)
                          .replace('{CHANNEL_ID}', intr.channel.id)
                          .replace('{GUILD_NAME}', intr.guild.name)
                          .replace('{GUILD_ID}', intr.guild.id)
                    : Logs.error.commandOther
                          .replace('{MESSAGE_ID}', intr.id)
                          .replace('{COMMAND_KEYWORD}', command.info.name)
                          .replace('{SENDER_TAG}', intr.user.tag)
                          .replace('{SENDER_ID}', intr.user.id),
                error
            );
        }
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
