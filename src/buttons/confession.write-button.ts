import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { SessionDataManager } from '../services/index.js';

export class WriteConfessionButton implements Button {
    public ids = ['write-confess-button'];
    public deferType = ButtonDeferType.NONE; // Change from UPDATE to NONE
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        if (SessionDataManager.getData(intr.user.id, 'confessionMessageID') == null || intr.message.id != SessionDataManager.getData(intr.user.id, 'confessionMessageID')) {
            await intr.message.delete();
            return;
        }
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('write-confess-modal')
            .setTitle('Write Your Confession');

        const confessionInput = new TextInputBuilder()
            .setCustomId('confession')
            .setLabel("What's your confession?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(4000)
            .setMinLength(20)
            .setPlaceholder('Enter your confession here...');

        // Add input to the modal
        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(confessionInput);

        modal.addComponents(actionRow);

        // This will now work because we're not deferring/updating first
        await intr.showModal(modal);
    }
}