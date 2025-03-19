import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';

import { Modal, ModalDeferType } from './modal.js';
import { EventData } from '../models/internal-models.js';

export class EchoModal implements Modal {
    public ids = ['echo-modal'];
    public deferType = ModalDeferType.NONE; // Set to NONE for modals 
    public requireGuild = false;

    public async execute(intr: ModalSubmitInteraction, _data: EventData): Promise<void> {
        // Get the data entered by the user
        const favoriteColor = intr.fields.getTextInputValue('favorite-color');
        
        // Hobbies are optional, so check if the user entered any
        let hobbies = '';
        try {
            hobbies = intr.fields.getTextInputValue('hobbies');
        } catch {
            // Field wasn't provided, silently continue
        }
        
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('Modal Submission')
            .setDescription('Here\'s what you submitted:')
            .addFields(
                { name: 'Favorite Color', value: favoriteColor || 'No color provided' },
                { name: 'Hobbies', value: hobbies || 'No hobbies provided' }
            )
            .setTimestamp();

        await intr.reply({ embeds: [embed], ephemeral: true });
    }
}