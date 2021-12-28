import { CommandInteraction, GuildMember, Permissions } from 'discord.js';
import { MessageUtils } from '.';
import { Command } from '../commands';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';

let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');

export class CommandUtils {
    public static async runChecks(
        command: Command,
        intr: CommandInteraction,
        data: EventData
    ): Promise<boolean> {
        if (command.requireDev && !Config.developers.includes(intr.user.id)) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.devOnlyCommand', data.lang())
            );
            return false;
        }

        if (command.requireGuild && !intr.guild) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.serverOnlyCommand', data.lang())
            );
            return false;
        }

        // TODO: Remove "as GuildMember",  why does discord.js have intr.member as a "APIInteractionGuildMember"?
        if (intr.member && !this.hasPermission(intr.member as GuildMember, command)) {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('validationEmbeds.permissionRequired', data.lang())
            );
            return false;
        }

        return true;
    }

    private static hasPermission(member: GuildMember, command: Command): boolean {
        // Debug option to bypass permission checks
        if (Debug.skip.checkPerms) {
            return true;
        }

        // Developers, server owners, and members with "Manage Server" have permission for all commands
        if (
            member.guild.ownerId === member.id ||
            member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ||
            Config.developers.includes(member.id)
        ) {
            return true;
        }

        // Check if member has required permissions for command
        if (!member.permissions.has(command.requirePerms)) {
            return false;
        }

        return true;
    }
}
