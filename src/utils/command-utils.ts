import { CommandInteraction, GuildChannel, GuildMember, Permissions } from 'discord.js';
import { createRequire } from 'node:module';

import { Command } from '../commands/index.js';
import { Permission } from '../models/enum-helpers/index.js';
import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { FormatUtils, InteractionUtils } from './index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Debug = require('../../config/debug.json');

export class CommandUtils {
    public static async runChecks(
        command: Command,
        intr: CommandInteraction,
        data: EventData
    ): Promise<boolean> {
        if (command.cooldown) {
            let limited = command.cooldown.take(intr.user.id);
            if (limited) {
                await InteractionUtils.send(
                    intr,
                    Lang.getEmbed('validationEmbeds.cooldownHit', data.lang(), {
                        AMOUNT: command.cooldown.amount.toLocaleString(),
                        INTERVAL: FormatUtils.duration(command.cooldown.interval, data.lang()),
                    })
                );
                return;
            }
        }

        if (command.requireDev && !Config.developers.includes(intr.user.id)) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.devOnlyCommand', data.lang())
            );
            return false;
        }

        if (command.requireGuild && !intr.guild) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.serverOnlyCommand', data.lang())
            );
            return false;
        }

        if (
            intr.channel instanceof GuildChannel &&
            !intr.channel.permissionsFor(intr.client.user).has(command.requireClientPerms)
        ) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.missingClientPerms', data.lang(), {
                    PERMISSIONS: command.requireClientPerms
                        .map(perm => `**${Permission.Data[perm].displayName(data.lang())}**`)
                        .join(', '),
                })
            );
            return false;
        }

        // TODO: Remove "as GuildMember",  why does discord.js have intr.member as a "APIInteractionGuildMember"?
        if (intr.member && !this.hasPermission(intr.member as GuildMember, command)) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.missingUserPerms', data.lang())
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
        if (!member.permissions.has(command.requireUserPerms)) {
            return false;
        }

        return true;
    }
}
