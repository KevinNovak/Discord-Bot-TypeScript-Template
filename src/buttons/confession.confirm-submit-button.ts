import { ButtonInteraction, Message } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import pool from '../services/database.js';
import { Lang, Logger, SessionDataManager } from '../services/index.js';

export class ConfirmConfessionSubmitButton implements Button {
    public ids = ['confession-confirm-submit-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        try {
            // Get all session data at once
            const userId = intr.user.id.toString();
            const confessionMessage:Message = SessionDataManager.getData(intr.user.id, 'confessionMessage');
            const confessionData = {
                userId,
                theme: SessionDataManager.getData(intr.user.id, 'theme'),
                language: SessionDataManager.getData(intr.user.id, 'language'),
                type: SessionDataManager.getData(intr.user.id, 'confessionType'),
                content: SessionDataManager.getData(intr.user.id, 'confessionContentMasked')
            };
            
            // Clear session data immediately to free up memory
            SessionDataManager.clearData(intr.user.id);
            
            // Save confession to database
            await this.saveConfession(confessionData);
            
            // Update UI
            await intr.editReply({
                components: [],
                embeds: [Lang.getEmbed('displayEmbeds.confession-sent', intr.locale)]
            });
            
            // Delete confession message after delay
            this.scheduleMessageDeletion(confessionMessage);
        } catch (error) {
            Logger.error('Error processing confession submission', error);
            await this.handleError(intr, error);
        }
    }
    
    private async saveConfession(data: {
        userId: string, 
        type: string, 
        language: string, 
        theme: string, 
        content: string
    }): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Insert confession
            await client.query(
                "INSERT INTO confessions (user_id, type, lang, theme, content) VALUES ($1, $2, $3, $4, $5)",
                [data.userId, data.type, data.language, data.theme, data.content]
            );
            
            // Update user stats
            await client.query(
                "UPDATE users SET total_confessions = total_confessions + 1 WHERE user_id = $1",
                [data.userId]
            );
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    private scheduleMessageDeletion(message?: Message): void {
        if (!message) return;
        
        setTimeout(async () => {
            try {
                await message.delete();
            } catch (error) {
                Logger.error('Error deleting confession message', error);
            }
        }, 10000);
    }
    
    private async handleError(intr: ButtonInteraction, error: unknown): Promise<void> {
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