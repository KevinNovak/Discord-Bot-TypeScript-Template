import { Client, DiscordAPIError, Guild, GuildMember, User } from 'discord.js-light';
import { RegexUtils } from '.';

export class ClientUtils {
    public static async getUser(client: Client, discordId: string): Promise<User> {
        discordId = RegexUtils.discordId(discordId);
        if (!discordId) {
            return;
        }

        try {
            return await client.users.fetch(discordId);
        } catch (error) {
            // Error code 10013: "Unknown User"
            if (error instanceof DiscordAPIError && [10013].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async findMember(guild: Guild, input: string): Promise<GuildMember> {
        let discordId = RegexUtils.discordId(input);
        try {
            if (discordId) {
                return await guild.members.fetch(discordId);
            } else {
                return (await guild.members.fetch({ query: input, limit: 1 })).first();
            }
        } catch (error) {
            // Error code 10007: "Unknown Member"
            // Error code 10013: "Unknown User"
            if (error instanceof DiscordAPIError && [10007, 10013].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
