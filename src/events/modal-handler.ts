import { ModalSubmitInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { EventHandler } from './index.js';
import { Modal, ModalDeferType } from '../modals/index.js';
import { EventDataService } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class ModalHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.modals.amount,
        Config.rateLimiting.modals.interval * 1000
    );

    constructor(
        private modals: Modal[],
        private eventDataService: EventDataService
    ) {}

    public async process(intr: ModalSubmitInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Try to find the modal the user submitted
        let modal = this.findModal(intr.customId);
        if (!modal) {
            return;
        }

        if (modal.requireGuild && !intr.guild) {
            return;
        }

        // Defer interaction
        switch (modal.deferType) {
            case ModalDeferType.REPLY: {
                await InteractionUtils.deferReply(intr);
                break;
            }
            case ModalDeferType.UPDATE: {
                await InteractionUtils.deferUpdate(intr);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (modal.deferType !== ModalDeferType.NONE && !intr.deferred) {
            return;
        }

        // Get data from database
        let data = await this.eventDataService.create({
            user: intr.user,
            channel: intr.channel,
            guild: intr.guild,
        });

        // Execute the modal
        await modal.execute(intr, data);
    }

    private findModal(id: string): Modal {
        return this.modals.find(modal => modal.ids.includes(id));
    }
}