export interface LoginRequest {
    callback: {
        url: string;
        token: string;
    };
    shardCount: number;
}

export interface LoginResponse {
    shardList: number[];
    totalShards: number;
}
