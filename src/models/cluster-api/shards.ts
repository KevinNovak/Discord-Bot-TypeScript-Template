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

export interface SetShardPresencesRequest {
    type: string;
    name: string;
    url: string;
}
