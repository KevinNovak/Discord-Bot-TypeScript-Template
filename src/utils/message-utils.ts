import {
    DiscordAPIError,
    DMChannel,
    EmojiResolvable,
    Message,
    MessageReaction,
    NewsChannel,
    StringResolvable,
    TextChannel,
    User,
} from 'discord.js-light';

export class MessageUtils {
    public static async send(
        target: User | DMChannel | TextChannel | NewsChannel,
        content: StringResolvable
    ): Promise<Message> {
        try {
            return await target.send(content);
        } catch (error) {
            // Error code 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (error instanceof DiscordAPIError && [50007].includes(error.code)) {
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
            if (error instanceof DiscordAPIError && [10008, 90001].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
