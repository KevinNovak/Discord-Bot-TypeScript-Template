import {
    CommandInteraction,
    GuildChannel,
    GuildMember,
    Permissions,
    ThreadChannel,
} from 'discord.js';
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
                return false;
            }
        }

        if (command.requireDev && !Config.developers.includes(intr.user.id)) {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('validationEmbeds.devOnlyCommand', data.lang())
            );
            return false;
        }

        if (
            (intr.channel instanceof GuildChannel || intr.channel instanceof ThreadChannel) &&
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

        return true;
    }
}
