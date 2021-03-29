import djs, { Message } from 'discord.js-light';
import fileSize from 'filesize';
import typescript from 'typescript';

import { LangCode } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils, ShardUtils } from '../utils';
import { Command } from './command';

let TsConfig = require('../../tsconfig.json');

export class DevCommand implements Command {
    public requireGuild = false;
    public requirePerms = [];

    public keyword(langCode: LangCode): string {
        return Lang.getRef('commands.dev', langCode);
    }

    public regex(langCode: LangCode): RegExp {
        return Lang.getRegex('commands.dev', langCode);
    }

    public async execute(msg: Message, args: string[], data: EventData): Promise<void> {
        let shardCount = msg.client.shard?.count ?? 1;
        let serverCount: number;
        if (msg.client.shard) {
            try {
                serverCount = await ShardUtils.serverCount(msg.client.shard);
            } catch (error) {
                // SHARDING_IN_PROCESS: Shards are still being spawned.
                if (error.name.includes('SHARDING_IN_PROCESS')) {
                    await MessageUtils.send(
                        msg.channel,
                        Lang.getEmbed('errors.startupInProcess', data.lang())
                    );
                    return;
                } else {
                    throw error;
                }
            }
        } else {
            serverCount = msg.client.guilds.cache.size;
        }

        let memory = process.memoryUsage();
        await MessageUtils.send(
            msg.channel,
            Lang.getEmbed('displays.dev', data.lang(), {
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
                SHARD_ID: (msg.guild?.shardID ?? 0).toString(),
                SERVER_ID: msg.guild?.id ?? Lang.getRef('other.na', data.lang()),
                BOT_ID: msg.client.user.id,
                USER_ID: msg.author.id,
            })
        );
    }
}
