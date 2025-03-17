import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    PermissionsString,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class SelectionCommand implements Command {
    public names = [Lang.getRef('chatCommands.select', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        // Create a select menu
        const select = new StringSelectMenuBuilder()
            .setCustomId('demo-select')
            .setPlaceholder('Make a selection...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 1')
                    .setDescription('The first option')
                    .setValue('option1')
                    .setEmoji('1️⃣'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 2')
                    .setDescription('The second option')
                    .setValue('option2')
                    .setEmoji('2️⃣'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 3')
                    .setDescription('The third option')
                    .setValue('option3')
                    .setEmoji('3️⃣')
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select);

        await InteractionUtils.send(
            intr,
            {
                content: 'Please select an option:',
                components: [row]
            }
        );
    }
}