export class FormatUtils {
    public static roleMention(discordId: string): string {
        return `<@&${discordId}>`;
    }

    public static channelMention(discordId: string): string {
        return `<#${discordId}>`;
    }

    public static userMention(discordId: string): string {
        return `<@!${discordId}>`;
    }
}
