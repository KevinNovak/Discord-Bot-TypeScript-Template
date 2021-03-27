export class MasterService {
    public static async myShardIds(clusterId: number, shardCount: number): Promise<number[]> {
        return [0, 1];
    }
}
