import { Allow, IsDefined, IsUrl } from 'class-validator';

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
    @IsDefined()
    @Allow()
    type: string;

    @IsDefined()
    @Allow()
    name: string;

    @IsDefined()
    @IsUrl()
    url: string;
}
