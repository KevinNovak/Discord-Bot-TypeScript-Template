import { RESTJSONErrorCodes as DiscordApiErrors } from 'discord-api-types/v9';
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    BaseCommandInteraction,
    DiscordAPIError,
    InteractionReplyOptions,
    InteractionUpdateOptions,
    Message,
    MessageComponentInteraction,
    MessageEmbed,
    ModalSubmitInteraction,
    WebhookEditMessageOptions,
} from 'discord.js';

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

export class InteractionUtils {
    public static async deferReply(
        intr: BaseCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
        hidden: boolean = false
    ): Promise<void> {
        try {
            return await intr.deferReply({
                ephemeral: hidden,
            });
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async deferUpdate(
        intr: MessageComponentInteraction | ModalSubmitInteraction
    ): Promise<void> {
        try {
            return await intr.deferUpdate();
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async send(
        intr: BaseCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
        content: string | MessageEmbed | InteractionReplyOptions,
        hidden: boolean = false
    ): Promise<Message> {
        try {
            let options: InteractionReplyOptions =
                typeof content === 'string'
                    ? { content }
                    : content instanceof MessageEmbed
                    ? { embeds: [content] }
                    : content;
            if (intr.deferred || intr.replied) {
                return (await intr.followUp({
                    ...options,
                    ephemeral: hidden,
                })) as Message;
            } else {
                return (await intr.reply({
                    ...options,
                    ephemeral: hidden,
                    fetchReply: true,
                })) as Message;
            }
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async respond(
        intr: AutocompleteInteraction,
        choices: ApplicationCommandOptionChoiceData[] = []
    ): Promise<void> {
        try {
            return await intr.respond(choices);
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async editReply(
        intr: BaseCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
        content: string | MessageEmbed | WebhookEditMessageOptions
    ): Promise<Message> {
        try {
            let options: WebhookEditMessageOptions =
                typeof content === 'string'
                    ? { content }
                    : content instanceof MessageEmbed
                    ? { embeds: [content] }
                    : content;
            return (await intr.editReply(options)) as Message;
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async update(
        intr: MessageComponentInteraction | ModalSubmitInteraction,
        content: string | MessageEmbed | InteractionUpdateOptions
    ): Promise<Message> {
        try {
            let options: InteractionUpdateOptions =
                typeof content === 'string'
                    ? { content }
                    : content instanceof MessageEmbed
                    ? { embeds: [content] }
                    : content;
            return (await intr.update({
                ...options,
                fetchReply: true,
            })) as Message;
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
