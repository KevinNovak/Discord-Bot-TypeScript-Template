import { RESTJSONErrorCodes as DiscordApiErrors } from 'discord-api-types/v9';
import { DiscordAPIError, ThreadChannel } from 'discord.js';

const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.CannotSendMessagesToThisUser, // User blocked bot or DM disabled
    DiscordApiErrors.ReactionWasBlocked, // User blocked bot or DM disabled
    DiscordApiErrors.MaximumActiveThreads,
];

export class ThreadUtils {
    public static async archive(
        thread: ThreadChannel,
        archived: boolean = true
    ): Promise<ThreadChannel> {
        try {
            return await thread.setArchived(archived);
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async lock(
        thread: ThreadChannel,
        locked: boolean = true
    ): Promise<ThreadChannel> {
        try {
            return await thread.setLocked(locked);
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
