import { CommandInteraction, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventHandler } from '.';
import { Command } from '../commands';
import { EventData } from '../models/internal-models';
import { Lang, Logger } from '../services';
import { CommandUtils, MessageUtils, PermissionUtils } from '../utils';

let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class CommandHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.amount,
        Config.rateLimiting.commands.interval * 1000
    );

    constructor(public commands: Command[]) {}

    public async process(intr: CommandInteraction): Promise<void> {
        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        await intr.deferReply();

        // TODO: Get data from database
        let data = new EventData();

        // Check if I have permission to send a message
        if (!PermissionUtils.canSendEmbed(intr.channel)) {
            let message = Lang.getRef('messages.missingEmbedPerms', data.lang());
            await MessageUtils.sendIntr(intr, message);
            return;
        }

        // Try to find the command the user wants
        let command = this.commands.find(command => command.data.name === intr.commandName);
        if (!command) {
            await this.sendError(intr, data);
            Logger.error(
                Logs.error.commandNotFound
                    .replaceAll('{INTERACTION_ID}', intr.id)
                    .replaceAll('{COMMAND_NAME}', command.data.name)
            );
            return;
        }

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
                          .replaceAll('{COMMAND_NAME}', command.data.name)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id)
                          .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                          .replaceAll('{CHANNEL_ID}', intr.channel.id)
                          .replaceAll('{GUILD_NAME}', intr.guild.name)
                          .replaceAll('{GUILD_ID}', intr.guild.id)
                    : Logs.error.commandOther
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{COMMAND_NAME}', command.data.name)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id),
                error
            );
        }
    }

    private async sendError(intr: CommandInteraction, data: EventData): Promise<void> {
        try {
            await MessageUtils.sendIntr(
                intr,
                Lang.getEmbed('errorEmbeds.command', data.lang(), {
                    ERROR_CODE: intr.id,
                })
            );
        } catch {
            // Ignore
        }
    }
}
