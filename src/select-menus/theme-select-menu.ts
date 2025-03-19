import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, Message, StringSelectMenuInteraction } from 'discord.js';
import { EventData } from '../models/internal-models.js';
import { SelectMenu, SelectMenuDeferType } from './index.js';
import { SessionDataManager } from '../services/session-data-manager.js';
import { Lang, Logger } from '../services/index.js';
import { LanguagesListUtils, ThemesListUtils } from '../utils/index.js';

export class ThemeSelectMenu implements SelectMenu {
    public ids = ['theme-select-menu'];
    public deferType = SelectMenuDeferType.NONE;
    public requireGuild = false;

    public async execute(intr: StringSelectMenuInteraction, data: EventData): Promise<void> {
        try {
            // Validate if this interaction is for the correct message
            if (!this.validateInteraction(intr)) {
                return;
            }

            // Get selected theme and update session data
            const selectedTheme = intr.values[0];
            SessionDataManager.setData(intr.user.id, 'theme', selectedTheme);

            // Get all required data for the review message
            const reviewData = this.prepareReviewData(intr.user.id, selectedTheme);
            
            // Create action row with submit/cancel buttons
            const actionRow = this.createActionRow();
            
            // Update the confession message with new data
            await this.updateConfessionMessage(
                reviewData.confessionMessage, 
                actionRow, 
                intr.locale, 
                reviewData
            );
            
            // Clean up the interaction
            await this.cleanupInteraction(intr);
        } catch (error) {
            Logger.error('Error processing theme selection', error);
            await this.handleError(intr);
        }
    }

    private validateInteraction(intr: StringSelectMenuInteraction): boolean {
        const messageId = SessionDataManager.getData(intr.user.id, 'confessionMessageID');
        
        if (messageId == null || intr.message.id !== messageId) {
            Logger.warn(`Confession message not found for user ${intr.user.id}`);
            intr.deleteReply().catch(error => 
                Logger.error('Failed to delete reply after validation failure', error)
            );
            return false;
        }
        
        return true;
    }
    
    private prepareReviewData(userId: string, selectedTheme: string): any {
        // Get confession message object
        const confessionMessage:Message = SessionDataManager.getData(userId, 'confessionMessage');
        
        // Get theme data
        const selectedThemeFullName = ThemesListUtils.getLabelByValue(selectedTheme);
        const selectedThemeEmoji = ThemesListUtils.getEmojiyValue(selectedTheme);
        
        // Get language data
        const selectedLanguage = SessionDataManager.getData(userId, 'language');
        const selectedLanguageFullName = LanguagesListUtils.getLabelByValue(selectedLanguage);
        const selectedLanguageFlag = SessionDataManager.getData(userId, 'languageFlag');
        
        // Get confession type
        const selectedConfessionType = SessionDataManager.getData(userId, 'confessionType');
        
        return {
            confessionMessage,
            TYPE: selectedConfessionType,
            LANGUAGE: selectedLanguageFullName,
            LANGUAGE_FLAG: selectedLanguageFlag,
            THEME: selectedThemeFullName,
            THEME_EMOJI: selectedThemeEmoji
        };
    }
    
    private createActionRow(): ActionRowBuilder<ButtonBuilder> {
        const submitButton = new ButtonBuilder()
            .setCustomId('confession-confirm-submit-button')
            .setLabel('Submit')
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId('confess-cancel-button')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents(submitButton, cancelButton);
    }
    
    private async updateConfessionMessage(
        message: Message, 
        actionRow: ActionRowBuilder<ButtonBuilder>, 
        locale: Locale, 
        data: any
    ): Promise<void> {
        try {
            await message.edit({
                content: '', 
                components: [actionRow],
                embeds: [Lang.getEmbed('displayEmbeds.confession-review', locale, data)]
            });
        } catch (error) {
            Logger.error('Error updating confession message', error);
            throw error; // Re-throw to be caught by execute method
        }
    }
    
    private async cleanupInteraction(intr: StringSelectMenuInteraction): Promise<void> {
        try {
            await intr.deferReply();
            await intr.deleteReply();
        } catch (error) {
            Logger.error('Error cleaning up interaction', error);
        }
    }
    
    private async handleError(intr: StringSelectMenuInteraction): Promise<void> {
        try {
            // If we haven't replied yet, defer the reply
            if (!intr.replied && !intr.deferred) {
                await intr.deferReply({ ephemeral: true });
            }
            
            // Send error message
            await intr.editReply({
                content: '',
                components: [],
                embeds: [Lang.getEmbed('errorEmbeds.command', intr.locale)]
            });
            
            // Delete the error message after a delay
            setTimeout(() => {
                intr.deleteReply().catch(error => 
                    Logger.error('Failed to delete error message', error)
                );
            }, 5000);
        } catch (errorHandlingError) {
            Logger.error('Failed to handle error', errorHandlingError);
        }
    }
}