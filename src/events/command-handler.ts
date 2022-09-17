import {
    AutocompleteInteraction,
    BaseCommandInteraction,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { Command, CommandDeferType } from '../commands/index.js';
import { EventData } from '../models/internal-models.js';
import { EventDataService, Lang, Logger } from '../services/index.js';
import { CommandUtils, InteractionUtils } from '../utils/index.js';
import { EventHandler } from './index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class CommandHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.amount,
        Config.rateLimiting.commands.interval * 1000
    );

    constructor(public commands: Command[], private eventDataService: EventDataService) {}

    public async process(intr: BaseCommandInteraction | AutocompleteInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        // Try to find the command the user wants
        let command = this.commands.find(command => command.metadata.name === intr.commandName);
        if (!command) {
            Logger.error(
                Logs.error.commandNotFound
                    .replaceAll('{INTERACTION_ID}', intr.id)
                    .replaceAll('{COMMAND_NAME}', intr.commandName)
            );
            return;
        }

        if (intr instanceof AutocompleteInteraction) {
            let option = intr.options.getFocused(true);

            if (!command.autocomplete) {
                Logger.error(
                    Logs.error.autocompleteNotFound
                        .replaceAll('{INTERACTION_ID}', intr.id)
                        .replaceAll('{COMMAND_NAME}', intr.commandName)
                        .replaceAll('{OPTION_NAME}', option.name)
                );
                return;
            }

            try {
                await command.autocomplete(intr, option);
            } catch (error) {
                Logger.error(
                    intr.channel instanceof TextChannel ||
                        intr.channel instanceof NewsChannel ||
                        intr.channel instanceof ThreadChannel
                        ? Logs.error.autocompleteGuild
                              .replaceAll('{INTERACTION_ID}', intr.id)
                              .replaceAll('{COMMAND_NAME}', command.metadata.name)
                              .replaceAll('{OPTION_NAME}', option.name)
                              .replaceAll('{USER_TAG}', intr.user.tag)
                              .replaceAll('{USER_ID}', intr.user.id)
                              .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                              .replaceAll('{CHANNEL_ID}', intr.channel.id)
                              .replaceAll('{GUILD_NAME}', intr.guild?.name)
                              .replaceAll('{GUILD_ID}', intr.guild?.id)
                        : Logs.error.autocompleteOther
                              .replaceAll('{INTERACTION_ID}', intr.id)
                              .replaceAll('{COMMAND_NAME}', command.metadata.name)
                              .replaceAll('{OPTION_NAME}', option.name)
                              .replaceAll('{USER_TAG}', intr.user.tag)
                              .replaceAll('{USER_ID}', intr.user.id),
                    error
                );
            }
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (command.deferType) {
            case CommandDeferType.PUBLIC: {
                await InteractionUtils.deferReply(intr, false);
                break;
            }
            case CommandDeferType.HIDDEN: {
                await InteractionUtils.deferReply(intr, true);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (command.deferType !== CommandDeferType.NONE && !intr.deferred) {
            return;
        }

        // Get data from database
        let data = await this.eventDataService.create({
            user: intr.user,
            channel: intr.channel,
            guild: intr.guild,
        });

        try {
            // Check if interaction passes command checks
            let passesChecks = await CommandUtils.runChecks(command, intr, data);
            if (passesChecks) {
                // Execute the command
                await command.execute(intr, data);
            }
        } catch (error) {
            await this.sendError(intr, data);

            // Log command error
            Logger.error(
                intr.channel instanceof TextChannel ||
                    intr.channel instanceof NewsChannel ||
                    intr.channel instanceof ThreadChannel
                    ? Logs.error.commandGuild
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{COMMAND_NAME}', command.metadata.name)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id)
                          .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                          .replaceAll('{CHANNEL_ID}', intr.channel.id)
                          .replaceAll('{GUILD_NAME}', intr.guild?.name)
                          .replaceAll('{GUILD_ID}', intr.guild?.id)
                    : Logs.error.commandOther
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{COMMAND_NAME}', command.metadata.name)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id),
                error
            );
        }
    }

    private async sendError(intr: BaseCommandInteraction, data: EventData): Promise<void> {
        try {
            await InteractionUtils.send(
                intr,
                Lang.getEmbed('errorEmbeds.command', data.lang, {
                    ERROR_CODE: intr.id,
                    GUILD_ID: intr.guild?.id ?? Lang.getRef('other.na', data.lang),
                    SHARD_ID: (intr.guild?.shardId ?? 0).toString(),
                })
            );
        } catch {
            // Ignore
        }
    }
}
