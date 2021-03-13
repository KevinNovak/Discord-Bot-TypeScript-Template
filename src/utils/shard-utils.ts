import { ShardClientUtil, ShardingManager, Util } from 'discord.js-light';
import { MathUtils } from '.';

export class ShardUtils {
    public static async recommendedShards(
        token: string,
        serversPerShard: number,
        shardsPerCluster: number
    ): Promise<number> {
        let recommendedShards = await Util.fetchRecommendedShards(token, serversPerShard);
        return MathUtils.ceilToMultiple(recommendedShards, shardsPerCluster);
    }

    public static myShardIds(clusterId: number, shardsPerCluster: number): number[] {
        return MathUtils.range(clusterId * shardsPerCluster, shardsPerCluster);
    }

    public static async serverCount(
        shardInterface: ShardingManager | ShardClientUtil
    ): Promise<number> {
        let shardGuildCounts: number[] = await shardInterface.fetchClientValues(
            'guilds.cache.size'
        );
        return MathUtils.sum(shardGuildCounts);
    }
}
