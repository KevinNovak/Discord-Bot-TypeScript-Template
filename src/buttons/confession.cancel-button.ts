import { ButtonInteraction } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { Lang, SessionDataManager } from '../services/index.js';

export class CancelConfessionButton implements Button {
    public ids = ['confess-cancel-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        SessionDataManager.clearData(intr.user.id);
        try {
            await intr.editReply({
                content: '',
                embeds: [Lang.getEmbed('displayEmbeds.confession-cancel', intr.locale)],
                components: []
            });

            setTimeout(async () => {
                await intr.deleteReply();
            }, 5000);
        } catch (error) {
            console.error("ERROR IN CONFESS CANCEL: ",error);
        }
    }
}