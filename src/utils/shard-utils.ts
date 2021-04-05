import { ShardClientUtil, ShardingManager, Util } from 'discord.js-light';
import { MathUtils } from '.';

export class ShardUtils {
    public static async recommendedShards(token: string, serversPerShard: number): Promise<number> {
        return Math.ceil(await Util.fetchRecommendedShards(token, serversPerShard));
    }

    public static shardIds(shardInterface: ShardingManager | ShardClientUtil): number[] {
        if (shardInterface instanceof ShardingManager) {
            return shardInterface.shards.map(shard => shard.id);
        } else if (shardInterface instanceof ShardClientUtil) {
            return shardInterface.ids;
        }
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
