import {
    DiscordAPIError,
    DMChannel,
    EmojiResolvable,
    Message,
    MessageReaction,
    StringResolvable,
    TextChannel,
    User,
} from 'discord.js';

export abstract class MessageUtils {
    public static async send(
        target: User | DMChannel | TextChannel,
        content: StringResolvable
    ): Promise<Message> {
        try {
            return await target.send(content);
        } catch (error) {
            // Error code 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (error instanceof DiscordAPIError && error.code === 50007) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async react(msg: Message, emoji: EmojiResolvable): Promise<MessageReaction> {
        try {
            return await msg.react(emoji);
        } catch (error) {
            // Error code 10008: "Unknown Message" (Message was deleted)
            // Error code 90001: "Reaction Blocked" (User blocked bot)
            if (
                error instanceof DiscordAPIError &&
                (error.code === 10008 || error.code === 90001)
            ) {
                return;
            } else {
                throw error;
            }
        }
    }
}
