import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Message,
    PermissionsString,
} from 'discord.js';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang, Logger, SessionDataManager } from '../../services/index.js';
import { Command, CommandDeferType } from '../index.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import pool from '../../services/database.js';

export class ConfessionCommand implements Command {
    public names = [Lang.getRef('chatCommands.confession', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.NONE; // Set to NONE for modals 
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        if (SessionDataManager.hasSession(intr.user.id)) {
            const confessionMessage : Message = SessionDataManager.getData(intr.user.id, 'confessionMessage');
            if (confessionMessage) {
                try {
                    await intr.reply({ content: 'You already have a confession in progress. Please complete or cancel it before starting a new one.', ephemeral: true }); //TODO: Use embed
                } catch (error) {
                    console.error('Error while editing/deleting the previous message:', error);
                }
                
            }
            return;
        }

        const userId = intr.user.id;
        try {
            const result = await pool.query(
                'SELECT rules_accepted FROM users WHERE user_id = $1',
                [userId]
            );

            const rulesAccepted = result.rows.length > 0 && result.rows[0].rules_accepted;

            if (!rulesAccepted) {
                const acceptButton = new ButtonBuilder()
                    .setCustomId('rules-accept-button')
                    .setLabel('Accept Rules')
                    .setStyle(ButtonStyle.Success);

                const declineButton = new ButtonBuilder()
                    .setCustomId('rules-decline-button')
                    .setLabel('Decline')
                    .setStyle(ButtonStyle.Danger);

                const rulesButtonRow = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(acceptButton, declineButton);

                await intr.reply({
                    embeds: [Lang.getEmbed('displayEmbeds.rules', intr.locale)],
                    components: [rulesButtonRow],
                    ephemeral: true
                });
                return;
            }
        } catch (error) {
            console.error('Database error checking rules acceptance:', error);
            await intr.reply({
                content: 'An error occurred while processing your request.',
                ephemeral: true
            });
            return;
        }

        const globalButton = new ButtonBuilder()
            .setCustomId('confess-global-button')
            .setLabel('Confess Globally')
            .setStyle(ButtonStyle.Primary);

        const guildButton = new ButtonBuilder()
            .setCustomId('confess-guild-button')
            .setLabel('Confess to Guild (Coming Soon)')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const typeButtonRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(globalButton, guildButton);

        //ON CLICK GO TO confession.global-button.ts or confession.guild-button.ts
        const confessionMessage = await intr.user.send(
            {
                embeds: [Lang.getEmbed('displayEmbeds.confession-type', intr.locale)],
                components: [typeButtonRow]
            },
        ).catch(async (error) => {
            Logger.error('Error while sending the message:', error);
            await intr.reply({ content: "I can't send you a private message. Please enable DM access in settings.", ephemeral: true }).catch(() => {});
            return;
        });

        if (confessionMessage) {
            SessionDataManager.setData(userId, 'confessionMessage', confessionMessage);
            SessionDataManager.setData(userId, 'confessionMessageID', confessionMessage.id);
        }
    
        //Si pas de guild trouvé
        if(intr.guildId == null) {
            await intr.deferReply(); // Acknowledge the interaction
            await intr.deleteReply(); // Delete the deferred reply
            return;
        };

        await intr.reply({ content: "I've sent you a message with the options to confess.", ephemeral: true });
    }
}