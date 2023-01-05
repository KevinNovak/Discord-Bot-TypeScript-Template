import djs, { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { createRequire } from 'node:module';
import os from 'node:os';
import typescript from 'typescript';

import { InfoOption } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { FormatUtils, InteractionUtils, ShardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const require = createRequire(import.meta.url);
let Config = require('../../../config/config.json');
let TsConfig = require('../../../tsconfig.json');

export class InfoCommand implements Command {
    public names = [Lang.getRef('chatCommands.info', Language.Default)];
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            option: intr.options.getString(
                Lang.getRef('arguments.option', Language.Default)
            ) as InfoOption,
        };

        let embed: EmbedBuilder;
        switch (args.option) {
            case InfoOption.ABOUT: {
                embed = Lang.getEmbed('displayEmbeds.about', data.lang);
                break;
            }
            case InfoOption.TRANSLATE: {
                embed = Lang.getEmbed('displayEmbeds.translate', data.lang);
                for (let langCode of Language.Enabled) {
                    embed.addFields([
                        {
                            name: Language.Data[langCode].nativeName,
                            value: Lang.getRef('meta.translators', langCode),
                        },
                    ]);
                }
                break;
            }
            case InfoOption.DEV: {
                if (!Config.developers.includes(intr.user.id)) {
                    await InteractionUtils.send(
                        intr,
                        Lang.getEmbed('validationEmbeds.devOnly', data.lang)
                    );
                    return;
                }

                let shardCount = intr.client.shard?.count ?? 1;
                let serverCount: number;
                if (intr.client.shard) {
                    try {
                        serverCount = await ShardUtils.serverCount(intr.client.shard);
                    } catch (error) {
                        if (error.name.includes('ShardingInProcess')) {
                            await InteractionUtils.send(
                                intr,
                                Lang.getEmbed('errorEmbeds.startupInProcess', data.lang)
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
                embed = Lang.getEmbed('displayEmbeds.dev', data.lang, {
                    NODE_VERSION: process.version,
                    TS_VERSION: `v${typescript.version}`,
                    ES_VERSION: TsConfig.compilerOptions.target,
                    DJS_VERSION: `v${djs.version}`,
                    SHARD_COUNT: shardCount.toLocaleString(data.lang),
                    SERVER_COUNT: serverCount.toLocaleString(data.lang),
                    SERVER_COUNT_PER_SHARD: Math.round(serverCount / shardCount).toLocaleString(
                        data.lang
                    ),
                    RSS_SIZE: FormatUtils.fileSize(memory.rss),
                    RSS_SIZE_PER_SERVER:
                        serverCount > 0
                            ? FormatUtils.fileSize(memory.rss / serverCount)
                            : Lang.getRef('other.na', data.lang),
                    HEAP_TOTAL_SIZE: FormatUtils.fileSize(memory.heapTotal),
                    HEAP_TOTAL_SIZE_PER_SERVER:
                        serverCount > 0
                            ? FormatUtils.fileSize(memory.heapTotal / serverCount)
                            : Lang.getRef('other.na', data.lang),
                    HEAP_USED_SIZE: FormatUtils.fileSize(memory.heapUsed),
                    HEAP_USED_SIZE_PER_SERVER:
                        serverCount > 0
                            ? FormatUtils.fileSize(memory.heapUsed / serverCount)
                            : Lang.getRef('other.na', data.lang),
                    HOSTNAME: os.hostname(),
                    SHARD_ID: (intr.guild?.shardId ?? 0).toString(),
                    SERVER_ID: intr.guild?.id ?? Lang.getRef('other.na', data.lang),
                    BOT_ID: intr.client.user?.id,
                    USER_ID: intr.user.id,
                });
                break;
            }
            default: {
                return;
            }
        }

        await InteractionUtils.send(intr, embed);
    }
}
