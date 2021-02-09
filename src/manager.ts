import { Shard, ShardingManager } from 'discord.js-light';

import { Job } from './jobs';
import { Logger } from './services';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

export class Manager {
    constructor(private shardManager: ShardingManager, private jobs: Job[]) {}

    public async start(): Promise<void> {
        this.registerListeners();

        try {
            Logger.info(
                Logs.info.spawningShards.replace(
                    '{SHARD_COUNT}',
                    this.shardManager.totalShards.toLocaleString()
                )
            );
            await this.shardManager.spawn(
                this.shardManager.totalShards,
                Config.sharding.spawnDelay * 1000,
                Config.sharding.spawnTimeout * 1000
            );
            Logger.info(Logs.info.allShardsSpawned);
        } catch (error) {
            Logger.error(Logs.error.spawnShard, error);
            return;
        }

        if (Debug.dummyMode.enabled) {
            return;
        }

        this.startJobs();
    }

    private registerListeners(): void {
        this.shardManager.on('shardCreate', shard => this.onShardCreate(shard));
    }

    private startJobs(): void {
        for (let job of this.jobs) {
            job.start();
        }
    }

    private onShardCreate(shard: Shard): void {
        Logger.info(Logs.info.launchedShard.replace('{SHARD_ID}', shard.id.toString()));
    }
}
