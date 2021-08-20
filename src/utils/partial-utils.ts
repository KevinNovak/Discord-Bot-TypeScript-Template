import { DiscordAPIError, Message, MessageReaction, PartialMessage } from 'discord.js';

// 10003: "Unknown Channel" (Channel was deleted)
// 10008: "Unknown Message" (Message was deleted)
// 50001: "Missing Access"
const IGNORED_ERROR_CODES = [10003, 10008, 50001];

export class PartialUtils {
    public static async fillMessage(msg: Message | PartialMessage): Promise<Message> {
        if (msg.partial) {
            try {
                return await msg.fetch();
            } catch (error) {
                if (error instanceof DiscordAPIError && IGNORED_ERROR_CODES.includes(error.code)) {
                    return;
                } else {
                    throw error;
                }
            }
        }

        return msg as Message;
    }

    public static async fillReaction(msgReaction: MessageReaction): Promise<MessageReaction> {
        if (msgReaction.partial) {
            try {
                msgReaction = await msgReaction.fetch();
            } catch (error) {
                if (error instanceof DiscordAPIError && IGNORED_ERROR_CODES.includes(error.code)) {
                    return;
                } else {
                    throw error;
                }
            }
        }

        msgReaction.message = await this.fillMessage(msgReaction.message);
        if (!msgReaction.message) {
            return;
        }

        return msgReaction;
    }
}
