import { IsDefined, IsEnum, IsString, IsUrl, MinLength } from 'class-validator';
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
    @IsString()
    @MinLength(2)
    name: string;

    @IsDefined()
    @IsUrl()
    url: string;
}
