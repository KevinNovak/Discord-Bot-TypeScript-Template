import { IsUrl } from 'class-validator';

export interface GetShardsResponse {
    id: number;
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
    type: string;

    name: string;

    @IsUrl()
    url: string;
}
