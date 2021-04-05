import { Allow, IsDefined, IsEnum, IsUrl } from 'class-validator';
import { Constants } from 'discord.js';

export interface GetShardsResponse {
    shards: ShardInfo[];
    stats: ShardStats;
}

export interface ShardStats {
    shardCount: number;
    uptimeSecs: number;
}

export interface ShardInfo {
    id: number;
    ready: boolean;
    error: boolean;
    uptimeSecs?: number;
}

export class SetShardPresencesRequest {
    @IsDefined()
    @IsEnum(Constants.ActivityTypes)
    type: string;

    @IsDefined()
    name: string;

    @IsDefined()
    @IsUrl()
    url: string;
}
