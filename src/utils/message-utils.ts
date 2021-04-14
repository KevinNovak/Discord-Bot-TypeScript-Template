import {
    Channel,
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
    public static async send(target: User | Channel, content: StringResolvable): Promise<Message> {
        try {
            if (
                target instanceof User ||
                target instanceof DMChannel ||
                target instanceof TextChannel ||
                target instanceof NewsChannel
            ) {
                return await target.send(content);
            }
        } catch (error) {
            // 10003: "Unknown channel"
            // 10004: "Unknown guild"
            // 10013: "Unknown user"
            // 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (
                error instanceof DiscordAPIError &&
                [10003, 10004, 10013, 50007].includes(error.code)
            ) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async reply(msg: Message, content: StringResolvable): Promise<Message> {
        try {
            return await msg.reply(content);
        } catch (error) {
            // 10008: "Unknown Message" (Message was deleted)
            // 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (error instanceof DiscordAPIError && [10008, 50007].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async edit(msg: Message, content: StringResolvable): Promise<Message> {
        try {
            return await msg.edit(content);
        } catch (error) {
            // 10008: "Unknown Message" (Message was deleted)
            // 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (error instanceof DiscordAPIError && [10008, 50007].includes(error.code)) {
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
            // 10008: "Unknown Message" (Message was deleted)
            // 90001: "Reaction Blocked" (User blocked bot)
            if (error instanceof DiscordAPIError && [10008, 90001].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async delete(msg: Message): Promise<Message> {
        try {
            return await msg.delete();
        } catch (error) {
            // 10008: "Unknown Message" (Message was deleted)
            // 50007: "Cannot send messages to this user" (User blocked bot or DM disabled)
            if (error instanceof DiscordAPIError && [10008, 50007].includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
