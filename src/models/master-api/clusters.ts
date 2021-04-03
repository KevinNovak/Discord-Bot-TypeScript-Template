export interface RegisterClusterRequest {
    shardCount: number;
    callback: {
        url: string;
        token: string;
    };
}

export interface RegisterClusterResponse {
    id: string;
}

export interface LoginClusterResponse {
    shardList: number[];
    totalShards: number;
}
