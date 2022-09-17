import { BaseCommandInteraction, GuildChannel, ThreadChannel } from 'discord.js';

import { Command } from '../commands/index.js';
import { Permission } from '../models/enum-helpers/index.js';
import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { FormatUtils, InteractionUtils } from './index.js';

export class CommandUtils {
    public static async runChecks(
        command: Command,
        intr: BaseCommandInteraction,
        data: EventData
    ): Promise<boolean> {
        if (command.cooldown) {
            let limited = command.cooldown.take(intr.user.id);
            if (limited) {
                await InteractionUtils.send(
                    intr,
                    Lang.getEmbed('validationEmbeds.cooldownHit', data.lang, {
                        AMOUNT: command.cooldown.amount.toLocaleString(),
                        INTERVAL: FormatUtils.duration(command.cooldown.interval, data.lang),
                    })
                );
                return false;
            }
        }

        if (
            (intr.channel instanceof GuildChannel || intr.channel instanceof ThreadChannel) &&
            !intr.channel.permissionsFor(intr.client.user).has(command.requireClientPerms)
        ) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.missingClientPerms', data.lang, {
                    PERMISSIONS: command.requireClientPerms
                        .map(perm => `**${Permission.Data[perm].displayName(data.lang)}**`)
                        .join(', '),
                })
            );
            return false;
        }

        return true;
    }
}
