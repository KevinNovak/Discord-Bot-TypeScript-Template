import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    PermissionsString,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { Command, CommandDeferType } from '../index.js';
import { RateLimiter } from 'discord.js-rate-limiter';

export class EchoCommand implements Command {
    public names = [Lang.getRef('chatCommands.echo', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.NONE; // Set to NONE for modals 
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('echo-modal')
            .setTitle('Echo Modal Example');

        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favorite-color')
            .setLabel("What's your favorite color?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('Enter your favorite color');

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbies')
            .setLabel("What are some of your hobbies?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setPlaceholder('Tell me about your hobbies...');

        // Add inputs to the modal
        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);

        modal.addComponents(firstActionRow, secondActionRow);

        await intr.showModal(modal);
    }
}