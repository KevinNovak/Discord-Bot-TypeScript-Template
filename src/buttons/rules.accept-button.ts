import { ButtonInteraction } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { InteractionUtils } from '../utils/index.js';
import pool from '../services/database.js';
import { Lang, Logger, SessionDataManager } from '../services/index.js';

export class RulesAcceptButton implements Button {
    public ids = ['rules-accept-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        try {
            // Clear any existing session data
            SessionDataManager.clearData(intr.user.id);
            
            // Update user's rules acceptance status
            await this.updateUserRulesStatus(intr.user.id.toString());
            
            // Show success message
            await InteractionUtils.editReply(intr, {
                components: [],
                embeds: [Lang.getEmbed('displayEmbeds.rules-accepted', intr.locale)],
            });
        } catch (error) {
            Logger.error('Error processing rules acceptance', error);
            await this.handleError(intr);
        }
    }
    
    private async updateUserRulesStatus(userId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Check if user exists and update accordingly
            const userExists = await client.query('SELECT 1 FROM users WHERE user_id = $1', [userId]);
            
            if (userExists.rowCount === 0) {
                // Insert new user with rules_accepted = true
                await client.query(
                    'INSERT INTO users (user_id, rules_accepted, joined_at) VALUES ($1, true, NOW())',
                    [userId]
                );
            } else {
                // Update existing user
                await client.query(
                    'UPDATE users SET rules_accepted = true WHERE user_id = $1',
                    [userId]
                );
            }
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    private async handleError(intr: ButtonInteraction): Promise<void> {
        try {
            await InteractionUtils.editReply(intr, {
                components: [],
                embeds: [Lang.getEmbed('errorEmbeds.command', intr.locale)],
            });
        } catch (replyError) {
            Logger.error('Failed to send error message', replyError);
        }
    }
}