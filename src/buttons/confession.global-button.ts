
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { Lang } from '../services/lang.js';
import { SessionDataManager } from '../services/session-data-manager.js';
import { LanguagesListUtils } from '../utils/languages-list-utils.js';

export class GlobalConfessionButton implements Button {
    public ids = ['confess-global-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        if(SessionDataManager.getData(intr.user.id, 'confessionMessageID') == null || intr.message.id != SessionDataManager.getData(intr.user.id, 'confessionMessageID')) {
            console.log("Confession message not found")
            intr.deleteReply();
            return;
        }
        SessionDataManager.setData(intr.user.id, 'confessionType', 'global');

        const languages = LanguagesListUtils.getLanguages();
        const select = new StringSelectMenuBuilder()
            .setCustomId('language-select-menu')
            .setPlaceholder('Select a language...') //TODO: Language to set
            .addOptions(
                languages.map(lang =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(lang.label)
                        .setDescription(lang.description)
                        .setValue(lang.value)
                        .setEmoji(lang.emoji)
                )
            );

        const cancelButton = new ButtonBuilder()
            .setCustomId('confess-cancel-button')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select);

        const cancelRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(cancelButton);

        //Il a déjà choisi le type, maintenant il choisi la langue de la confession
        // maintenant => select-menus language-select-menu.ts
        await intr.editReply({
            content: '',
            embeds: [Lang.getEmbed('displayEmbeds.confession-lang', intr.locale, { "TYPE": Lang.getRef('confession-types.global', intr.locale) })],
            components: [selectRow, cancelRow]
        });
    }
}