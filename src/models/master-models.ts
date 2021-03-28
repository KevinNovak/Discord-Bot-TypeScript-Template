export interface LoginRequest {
    shardCount: number;
    callback: {
        url: string;
        token: string;
    };
}

export interface LoginResponse {
    shardList: number[];
    totalShards: number;
}
