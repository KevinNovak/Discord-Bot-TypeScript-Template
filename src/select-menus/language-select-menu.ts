import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from 'discord.js';
import { EventData } from '../models/internal-models.js';
import { SelectMenu, SelectMenuDeferType } from './index.js';
import { Lang, Logger } from '../services/index.js';
import { SessionDataManager } from '../services/session-data-manager.js';
import { LanguagesListUtils } from '../utils/languages-list-utils.js';

export class LanguageSelectMenu implements SelectMenu {
    public ids = ['language-select-menu'];
    public deferType = SelectMenuDeferType.NONE;
    public requireGuild = false;

    public async execute(intr: StringSelectMenuInteraction, data: EventData): Promise<void> {
        try {
            // Validate if this interaction is for the correct message
            if (!this.validateInteraction(intr)) {
                return;
            }

            // Get selected language and update session data
            const languageSelected = intr.values[0];
            this.updateSessionData(intr.user.id, languageSelected);
            
            // Create action row with buttons
            const actionRow = this.createActionRow();
            
            // Update the confession message with new data
            await this.updateConfessionUI(intr, actionRow);
        } catch (error) {
            Logger.error('Error processing language selection', error);
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
    
    private updateSessionData(userId: string, languageSelected: string): void {
        // Store language selection
        SessionDataManager.setData(userId, 'language', languageSelected);
        
        // Store the language flag
        const languageFlag = LanguagesListUtils.getFlagByValue(languageSelected);
        SessionDataManager.setData(userId, 'languageFlag', languageFlag);
    }
    
    private createActionRow(): ActionRowBuilder<ButtonBuilder> {
        const continueButton = new ButtonBuilder()
            .setCustomId('write-confess-button')
            .setLabel('Write the confession')
            .setStyle(ButtonStyle.Primary);

        const cancelButton = new ButtonBuilder()
            .setCustomId('confess-cancel-button')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents(continueButton, cancelButton);
    }
    
    private async updateConfessionUI(
        intr: StringSelectMenuInteraction, 
        actionRow: ActionRowBuilder<ButtonBuilder>
    ): Promise<void> {
        try {
            const confessionType = SessionDataManager.getData(intr.user.id, "confessionType") === 'global' 
                ? '🌍' 
                : '👥';
            const languageFlag = SessionDataManager.getData(intr.user.id, 'languageFlag');
            
            await intr.update({ 
                embeds: [Lang.getEmbed('displayEmbeds.confession-write', intr.locale, { 
                    TYPE: confessionType, 
                    LANGUAGE: languageFlag 
                })], 
                components: [actionRow], 
                content: '' 
            });
        } catch (error) {
            Logger.error('Error updating confession UI', error);
            throw error; // Re-throw to be caught by execute method
        }
    }
    
    private async handleError(intr: StringSelectMenuInteraction): Promise<void> {
        try {
            await intr.update({
                content: '',
                components: [],
                embeds: [Lang.getEmbed('errorEmbeds.command', intr.locale)]
            }).catch(() => {
                // If update fails, try to followUp instead
                intr.followUp({
                    ephemeral: true,
                    embeds: [Lang.getEmbed('errorEmbeds.command', intr.locale)]
                }).catch(error => 
                    Logger.error('Failed to send error followUp', error)
                );
            });
        } catch (errorHandlingError) {
            Logger.error('Failed to handle error', errorHandlingError);
        }
    }
}