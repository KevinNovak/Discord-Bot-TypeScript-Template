import { ButtonInteraction } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { Lang, Logger, SessionDataManager } from '../services/index.js';

export class RulesDeclineButton implements Button {
    public ids = ['rules-decline-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        try {
            // Clear any session data for this user
            SessionDataManager.clearData(intr.user.id);
            
            // Update UI to show decline message
            await intr.editReply({
                components: [],
                embeds: [Lang.getEmbed('displayEmbeds.rules-decline', intr.locale)]
            });
        } catch (error) {
            Logger.error('Error processing rules decline', error);
            await this.handleError(intr);
        }
    }
    
    private async handleError(intr: ButtonInteraction): Promise<void> {
        try {
            await intr.editReply({
                components: [],
                embeds: [Lang.getEmbed('errorEmbeds.command', intr.locale)]
            });
        } catch (replyError) {
            Logger.error('Failed to send error message', replyError);
        }
    }
}