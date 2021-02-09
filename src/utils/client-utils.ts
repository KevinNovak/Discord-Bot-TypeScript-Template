import { Client } from 'discord.js';
import { DiscordAPIError, Guild, GuildMember, TextChannel, User } from 'discord.js-light';

import { RegexUtils } from '.';
import { LangCode } from '../models/enums';
import { Lang } from '../services';
import { PermissionUtils } from './permission-utils';

export class ClientUtils {
    public static async getUser(client: Client, discordId: string): Promise<User> {
        discordId = RegexUtils.discordId(discordId);
        if (!discordId) {
            return;
        }

        try {
            return await client.users.fetch(discordId);
        } catch (error) {
            // 10013: "Unknown User"
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
            return discordId
                ? await guild.members.fetch(discordId)
                : (await guild.members.fetch({ query: input, limit: 1 })).first();
        } catch (error) {
            // 10007: "Unknown Member"
            // 10013: "Unknown User"
            if (error instanceof DiscordAPIError && [10007, 10013].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async findNotifyChannel(guild: Guild, langCode: LangCode): Promise<TextChannel> {
        // Prefer the system channel
        let systemChannel = guild.systemChannel;
        if (systemChannel && PermissionUtils.canSendEmbed(systemChannel)) {
            return systemChannel;
        }

        // Otherwise look for a bot channel
        return (await guild.channels.fetch()).find(
            channel =>
                channel instanceof TextChannel &&
                PermissionUtils.canSendEmbed(channel) &&
                Lang.getRegex('channels.bot', langCode).test(channel.name)
        ) as TextChannel;
    }
}
