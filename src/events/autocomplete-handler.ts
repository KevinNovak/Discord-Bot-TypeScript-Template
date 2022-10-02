import { AutocompleteInteraction, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { createRequire } from 'node:module';

import { Autocomplete } from '../autocompletes/index.js';
import { DiscordLimits } from '../constants/index.js';
import { EventDataService, Logger } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';
import { EventHandler } from './index.js';

const require = createRequire(import.meta.url);
let Logs = require('../../lang/logs.json');

export class AutocompleteHandler implements EventHandler {
    constructor(public autocompletes: Autocomplete[], private eventDataService: EventDataService) {}

    public async process(intr: AutocompleteInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        let option = intr.options.getFocused(true);

        // Try to find the autocomplete the user wants
        let autocomplete = this.autocompletes.find(
            autocomplete => autocomplete.name === option.name
        );
        if (!autocomplete) {
            Logger.error(
                Logs.error.autocompleteNotFound
                    .replaceAll('{INTERACTION_ID}', intr.id)
                    .replaceAll('{OPTION_NAME}', option.name)
            );
            return;
        }

        // Require min length to start autocomplete
        if (option.value.length < autocomplete.minLength) {
            await InteractionUtils.respond(intr);
            return;
        }

        try {
            let data = await this.eventDataService.create();
            let choices = await autocomplete.execute(intr, option, data);
            await InteractionUtils.respond(
                intr,
                choices.slice(0, DiscordLimits.CHOICES_PER_AUTOCOMPLETE)
            );
        } catch (error) {
            Logger.error(
                intr.channel instanceof TextChannel ||
                    intr.channel instanceof NewsChannel ||
                    intr.channel instanceof ThreadChannel
                    ? Logs.error.autocompleteGuild
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{OPTION_NAME}', option.name)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id)
                          .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                          .replaceAll('{CHANNEL_ID}', intr.channel.id)
                          .replaceAll('{GUILD_NAME}', intr.guild?.name)
                          .replaceAll('{GUILD_ID}', intr.guild?.id)
                    : Logs.error.autocompleteOther
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{OPTION_NAME}', option.name)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id),
                error
            );
        }
        return;
    }
}
