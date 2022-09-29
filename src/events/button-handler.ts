import { ButtonInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { Button, ButtonDeferType } from '../buttons/index.js';
import { EventDataService } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';
import { EventHandler } from './index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class ButtonHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.buttons.amount,
        Config.rateLimiting.buttons.interval * 1000
    );

    constructor(private buttons: Button[], private eventDataService: EventDataService) {}

    public async process(intr: ButtonInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Try to find the button the user wants
        let button = this.findButton(intr.customId);
        if (!button) {
            return;
        }

        if (button.requireGuild && !intr.guild) {
            return;
        }

        // Check if the embeds author equals the users tag
        if (
            button.requireEmbedAuthorTag &&
            intr.message.embeds[0]?.author?.name !== intr.user.tag
        ) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (button.deferType) {
            case ButtonDeferType.REPLY: {
                await InteractionUtils.deferReply(intr);
                break;
            }
            case ButtonDeferType.UPDATE: {
                await InteractionUtils.deferUpdate(intr);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (button.deferType !== ButtonDeferType.NONE && !intr.deferred) {
            return;
        }

        // Get data from database
        let data = await this.eventDataService.create({
            user: intr.user,
            channel: intr.channel,
            guild: intr.guild,
        });

        // Execute the button
        await button.execute(intr, data);
    }

    private findButton(id: string): Button {
        return this.buttons.find(button => button.ids.includes(id));
    }
}
