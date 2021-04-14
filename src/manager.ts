import { Shard, ShardingManager } from 'discord.js-light';

import { JobService, Logger } from './services';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

export class Manager {
    constructor(private shardManager: ShardingManager, private jobService: JobService) {}

    public async start(): Promise<void> {
        this.registerListeners();

        // TODO: Refactor this once DJS fixes their typings
        // tslint:disable-next-line:no-string-literal
        let shardList: number[] = this.shardManager['shardList'];

        try {
            Logger.info(
                Logs.info.managerSpawningShards
                    .replace('{SHARD_COUNT}', shardList.length.toLocaleString())
                    .replace('{SHARD_LIST}', shardList.join(', '))
            );
            await this.shardManager.spawn(
                this.shardManager.totalShards,
                Config.sharding.spawnDelay * 1000,
                Config.sharding.spawnTimeout * 1000
            );
            Logger.info(Logs.info.managerAllShardsSpawned);
        } catch (error) {
            Logger.error(Logs.error.managerSpawningShards, error);
            return;
        }

        if (Debug.dummyMode.enabled) {
            return;
        }

        this.jobService.start();
    }

    private registerListeners(): void {
        this.shardManager.on('shardCreate', shard => this.onShardCreate(shard));
    }

    private onShardCreate(shard: Shard): void {
        Logger.info(Logs.info.managerLaunchedShard.replace('{SHARD_ID}', shard.id.toString()));
    }
}
