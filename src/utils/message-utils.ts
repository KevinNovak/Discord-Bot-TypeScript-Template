import {
    DiscordAPIError,
    DMChannel,
    EmojiResolvable,
    Message,
    StringResolvable,
    TextChannel,
    User,
} from 'discord.js';

export abstract class MessageUtils {
    public static async send(
        target: User | DMChannel | TextChannel,
        content: StringResolvable
    ): Promise<void> {
        try {
            await target.send(content);
        } catch (error) {
            // Error code 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (error instanceof DiscordAPIError && error.code === 50007) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async react(msg: Message, emoji: EmojiResolvable): Promise<void> {
        try {
            await msg.react(emoji);
        } catch (error) {
            // Error code 90001: "Reaction blocked" (User blocked bot)
            if (error instanceof DiscordAPIError && error.code === 90001) {
                return;
            } else {
                throw error;
            }
        }
    }
}
