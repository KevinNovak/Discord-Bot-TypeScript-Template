export interface GetInfoResponse {
    id: number;
    shards: ShardInfo[];
    stats: ClusterStats;
}

export interface ClusterStats {
    shardCount: number;
    serverCount: number;
    uptimeSecs: number;
}

export interface ShardInfo {
    id: number;
    ready: boolean;
    error: boolean;
    serverCount?: number;
    uptimeSecs?: number;
}
