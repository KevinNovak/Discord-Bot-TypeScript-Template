import djs, { ApplicationCommandData, CommandInteraction } from 'discord.js';
import fileSize from 'filesize';
import os from 'os';
import typescript from 'typescript';

import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils, ShardUtils } from '../utils';
import { Command } from './command';

let TsConfig = require('../../tsconfig.json');

export class DevCommand implements Command {
    public data: ApplicationCommandData = {
        name: Lang.getCom('commands.dev'),
        description: Lang.getRef('commandDescs.dev', Lang.Default),
    };
    public requireDev = true;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let shardCount = intr.client.shard?.count ?? 1;
        let serverCount: number;
        if (intr.client.shard) {
            try {
                serverCount = await ShardUtils.serverCount(intr.client.shard);
            } catch (error) {
                // SHARDING_IN_PROCESS: Shards are still being spawned.
                if (error.name.includes('SHARDING_IN_PROCESS')) {
                    await MessageUtils.sendIntr(
                        intr,
                        Lang.getEmbed('errorEmbeds.startupInProcess', data.lang())
                    );
                    return;
                } else {
                    throw error;
                }
            }
        } else {
            serverCount = intr.client.guilds.cache.size;
        }

        let memory = process.memoryUsage();
        await MessageUtils.sendIntr(
            intr,
            Lang.getEmbed('displayEmbeds.dev', data.lang(), {
                NODE_VERSION: process.version,
                TS_VERSION: `v${typescript.version}`,
                ES_VERSION: TsConfig.compilerOptions.target,
                DJS_VERSION: `v${djs.version}`,
                SHARD_COUNT: shardCount.toLocaleString(),
                SERVER_COUNT: serverCount.toLocaleString(),
                SERVER_COUNT_PER_SHARD: Math.round(serverCount / shardCount).toLocaleString(),
                RSS_SIZE: fileSize(memory.rss),
                RSS_SIZE_PER_SERVER:
                    serverCount > 0
                        ? fileSize(memory.rss / serverCount)
                        : Lang.getRef('other.na', data.lang()),
                HEAP_TOTAL_SIZE: fileSize(memory.heapTotal),
                HEAP_TOTAL_SIZE_PER_SERVER:
                    serverCount > 0
                        ? fileSize(memory.heapTotal / serverCount)
                        : Lang.getRef('other.na', data.lang()),
                HEAP_USED_SIZE: fileSize(memory.heapUsed),
                HEAP_USED_SIZE_PER_SERVER:
                    serverCount > 0
                        ? fileSize(memory.heapUsed / serverCount)
                        : Lang.getRef('other.na', data.lang()),
                HOSTNAME: os.hostname(),
                SHARD_ID: (intr.guild?.shardId ?? 0).toString(),
                SERVER_ID: intr.guild?.id ?? Lang.getRef('other.na', data.lang()),
                BOT_ID: intr.client.user.id,
                USER_ID: intr.user.id,
            })
        );
    }
}
