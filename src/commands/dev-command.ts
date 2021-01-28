import djs, { Message } from 'discord.js';
import typescript from 'typescript';

import { LangCode } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
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
        let memoryUsage = process.memoryUsage();
        await MessageUtils.send(
            msg.channel,
            Lang.getEmbed('commands.dev', data.lang(), {
                NODE_VERSION: process.version,
                TS_VERSION: `v${typescript.version}`,
                ES_VERSION: TsConfig.compilerOptions.target,
                DJS_VERSION: `v${djs.version}`,
                SHARD_ID: (msg.guild?.shardID ?? 0).toString(),
                SERVER_ID: msg.guild?.id ?? Lang.getRef('other.na', data.lang()),
                USER_ID: msg.author.id,
                RSS_SIZE: `${this.bytesToMB(memoryUsage.rss)} MB`,
                HEAP_TOTAL_SIZE: `${this.bytesToMB(memoryUsage.heapTotal)} MB`,
                HEAP_USED_SIZE: `${this.bytesToMB(memoryUsage.heapUsed)} MB`,
            })
        );
    }

    private bytesToMB(bytes: number): number {
        return Math.round((bytes / 1024 / 1024) * 100) / 100;
    }
}
