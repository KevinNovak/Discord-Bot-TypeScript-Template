import { DiscordAPIError, Guild, GuildMember } from 'discord.js';
import { RegexUtils } from '.';

export class GuildUtils {
    public static async findMember(guild: Guild, input: string): Promise<GuildMember> {
        let discordId = RegexUtils.discordId(input);
        try {
            if (discordId) {
                return await guild.members.fetch(discordId);
            } else {
                return (await guild.members.fetch({ query: input, limit: 1 })).first();
            }
        } catch (error) {
            // Error code 10013: "Unknown User"
            if (error instanceof DiscordAPIError && [10013].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
