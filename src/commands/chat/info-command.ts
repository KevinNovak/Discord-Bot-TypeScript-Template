import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import djs, { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';
import fileSize from 'filesize';
import { createRequire } from 'node:module';
import os from 'node:os';
import typescript from 'typescript';

import { InfoOption, LangCode } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils, ShardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const require = createRequire(import.meta.url);
let Config = require('../../../config/config.json');
let TsConfig = require('../../../tsconfig.json');

export class InfoCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.info'),
        description: Lang.getRef('commandDescs.info', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                name: Lang.getCom('arguments.option'),
                description: 'Option.',
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: Lang.getRef('infoOptions.about', Lang.Default),
                        value: InfoOption.ABOUT,
                    },
                    {
                        name: Lang.getRef('infoOptions.translate', Lang.Default),
                        value: InfoOption.TRANSLATE,
                    },
                    {
                        name: Lang.getRef('infoOptions.dev', Lang.Default),
                        value: InfoOption.DEV,
                    },
                ],
            },
        ],
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let option = intr.options.getString(Lang.getCom('arguments.option'));

        let embed: MessageEmbed;
        switch (option) {
            case InfoOption.ABOUT: {
                embed = Lang.getEmbed('displayEmbeds.about', data.lang());
                break;
            }
            case InfoOption.TRANSLATE: {
                embed = Lang.getEmbed('displayEmbeds.translate', data.lang());
                for (let langCode of Object.values(LangCode)) {
                    embed.addFields([
                        {
                            name: Language.displayName(langCode),
                            value: Language.translators(langCode),
                        },
                    ]);
                }
                break;
            }
            case InfoOption.DEV: {
                if (!Config.developers.includes(intr.user.id)) {
                    await InteractionUtils.send(
                        intr,
                        Lang.getEmbed('validationEmbeds.devOnly', data.lang())
                    );
                    return;
                }

                let shardCount = intr.client.shard?.count ?? 1;
                let serverCount: number;
                if (intr.client.shard) {
                    try {
                        serverCount = await ShardUtils.serverCount(intr.client.shard);
                    } catch (error) {
                        // SHARDING_IN_PROCESS: Shards are still being spawned.
                        if (error.name.includes('SHARDING_IN_PROCESS')) {
                            await InteractionUtils.send(
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
                embed = Lang.getEmbed('displayEmbeds.dev', data.lang(), {
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
