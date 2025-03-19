import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { Lang, SessionDataManager } from '../services/index.js';
import { ThemesListUtils } from '../utils/index.js';

export class ChangeLanguageAcceptButton implements Button {
    public ids = ['confess-change-language-accept-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        if (SessionDataManager.getData(intr.user.id, 'confessionMessageID') == null || intr.message.id != SessionDataManager.getData(intr.user.id, 'confessionMessageID')) {
            console.log("Confession message not found")
            intr.deleteReply();
            return;
        }

        const detectedLanguage = SessionDataManager.getData(intr.user.id, 'detectedLanguage');
        const confessionMessage = SessionDataManager.getData(intr.user.id, 'confessionMessage');
        SessionDataManager.setData(intr.user.id, 'language', detectedLanguage);
        try {
            const themes = ThemesListUtils.getThemes();

            const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('theme-select-menu')
                        .setPlaceholder('Select a subject for your confession')
                        .addOptions(themes.map(theme => ({
                            value: theme.value,
                            description: theme.description,
                            label: theme.label,
                            emoji: theme.emoji
                        })))
                );

            const cancelButton = new ButtonBuilder()
                .setCustomId('confess-cancel-button')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger);

            const buttonsRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(cancelButton);
            await confessionMessage.edit({ content: ``, embeds: [Lang.getEmbed("displayEmbeds.confession-theme", intr.locale)], components: [selectMenu, buttonsRow] });
        } catch (error) {
            console.error("ERROR IN CONFESS CANCEL: ", error);
        }
    }
}