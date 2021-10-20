import {
    CommandInteraction,
    DiscordAPIError,
    EmojiResolvable,
    Message,
    MessageEmbed,
    MessageOptions,
    MessageReaction,
    TextBasedChannels,
    User,
} from 'discord.js';

export class MessageUtils {
    public static async send(
        target: User | TextBasedChannels,
        content: string | MessageEmbed | MessageOptions
    ): Promise<Message> {
        try {
            let msgOptions = this.messageOptions(content);
            return await target.send(msgOptions);
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

    public static async sendIntr(
        intr: CommandInteraction,
        content: string | MessageEmbed | MessageOptions
    ): Promise<Message> {
        try {
            let msgOptions = this.messageOptions(content);
            return (await intr.webhook.send(msgOptions)) as Message;
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

    public static async reply(
        msg: Message,
        content: string | MessageEmbed | MessageOptions
    ): Promise<Message> {
        try {
            let msgOptions = this.messageOptions(content);
            return await msg.reply(msgOptions);
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

    public static async edit(
        msg: Message,
        content: string | MessageEmbed | MessageOptions
    ): Promise<Message> {
        try {
            let msgOptions = this.messageOptions(content);
            return await msg.edit(msgOptions);
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

    private static messageOptions(content: string | MessageEmbed | MessageOptions): MessageOptions {
        let options: MessageOptions = {};
        if (typeof content === 'string') {
            options.content = content;
        } else if (content instanceof MessageEmbed) {
            options.embeds = [content];
        } else {
            options = content;
        }
        return options;
    }
}
