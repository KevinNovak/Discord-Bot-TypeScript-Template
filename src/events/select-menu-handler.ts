import { StringSelectMenuInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { EventHandler } from './index.js';
import { SelectMenu, SelectMenuDeferType } from '../select-menus/index.js';
import { EventDataService } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class SelectMenuHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.selectMenus.amount,
        Config.rateLimiting.selectMenus.interval * 1000
    );

    constructor(
        private selectMenus: SelectMenu[],
        private eventDataService: EventDataService
    ) {}

    public async process(intr: StringSelectMenuInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Try to find the select menu the user wants
        let selectMenu = this.findSelectMenu(intr.customId);
        if (!selectMenu) {
            return;
        }

        if (selectMenu.requireGuild && !intr.guild) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (selectMenu.deferType) {
            case SelectMenuDeferType.REPLY: {
                await InteractionUtils.deferReply(intr);
                break;
            }
            case SelectMenuDeferType.UPDATE: {
                await InteractionUtils.deferUpdate(intr);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (selectMenu.deferType !== SelectMenuDeferType.NONE && !intr.deferred) {
            return;
        }

        // Get data from database
        let data = await this.eventDataService.create({
            user: intr.user,
            channel: intr.channel,
            guild: intr.guild,
        });

        // Execute the select menu
        await selectMenu.execute(intr, data);
    }

    private findSelectMenu(id: string): SelectMenu {
        return this.selectMenus.find(selectMenu => selectMenu.ids.includes(id));
    }
}