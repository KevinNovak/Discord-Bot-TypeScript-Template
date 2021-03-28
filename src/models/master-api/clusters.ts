export interface GetClustersResponse {
    clusters: {
        clusterId: number;
        shardCount: number;
        shardList: number[];
    }[];
}

export interface LoginClusterRequest {
    shardCount: number;
    callback: {
        url: string;
        token: string;
    };
}

export interface LoginClusterResponse {
    shardList: number[];
    totalShards: number;
}
