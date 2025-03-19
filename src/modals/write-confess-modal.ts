import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, ModalSubmitInteraction, StringSelectMenuBuilder } from 'discord.js';

import { Modal, ModalDeferType } from './modal.js';
import { EventData } from '../models/internal-models.js';
import { Lang, SessionDataManager } from '../services/index.js';
import { ThemesListUtils } from '../utils/themes-list-utils.js';
import { SensitiveDataMasker } from '../utils/mask-sensitive-data.js';
import { SpamDetector } from '../utils/spam-detector.js';
import { perspectiveApi } from '../utils/perspective-api.js';
import { LanguagesListUtils } from '../utils/languages-list-utils.js';

export class writeConfessModal implements Modal {
    public ids = ['write-confess-modal'];
    public deferType = ModalDeferType.NONE; // Set to NONE for modals 
    public requireGuild = false;

    public async execute(intr: ModalSubmitInteraction, _data: EventData): Promise<void> {
        if (SessionDataManager.getData(intr.user.id, 'confessionMessageID') == null || intr.message.id != SessionDataManager.getData(intr.user.id, 'confessionMessageID')) {
            console.log("Confession message not found")
            return;
        }

        const confessionMessage: Message = SessionDataManager.getData(intr.user.id, 'confessionMessage');
        if (confessionMessage === null) {
            console.log("Confession message not found")
            intr.reply("Confession message not found 😱")
            return;
        }

        const confessionContent = intr.fields.getTextInputValue('confession');

        //Pas possible car le champ est obligatoire mais on ne sait jamais
        if (confessionContent === null || confessionContent === "") {
            await intr.reply({ content: "Confession cannot be empty", ephemeral: true });
            return;
        }

        //Verify if spam
        const detector = new SpamDetector();
        const confessionSpamResult = detector.detectSpam(confessionContent)
        if (confessionSpamResult.isSpam) {
            await intr.reply({ embeds: [Lang.getEmbed('displayEmbeds.confesson-detected-spam',intr.locale,{REASONS: confessionSpamResult.reasons.join('\n')})], ephemeral: true });
            return;
        }

        //Verify with perspective
        const analysisResult = await perspectiveApi.analyzeText(confessionContent);
        if (analysisResult.scores.TOXICITY > 0.95) {
            await intr.reply({ embeds: [Lang.getEmbed('displayEmbeds.confession-vulgar-content',intr.locale)], ephemeral: true });
            return;
        }

        //Verify language
        const selectedLanguage = SessionDataManager.getData(intr.user.id, 'language');
        const selectedLanguageFullName = LanguagesListUtils.getLabelByValue(selectedLanguage);
        const selectedLanguageFlag = SessionDataManager.getData(intr.user.id, 'languageFlag');

        const detectedLanguage = analysisResult.languages[0];
        const detectedLanguageFullName = LanguagesListUtils.getLabelByValue(detectedLanguage);
        const detectedLanguageFlag = LanguagesListUtils.getFlagByValue(detectedLanguage);

        SessionDataManager.setData(intr.user.id, 'detectedLanguage', detectedLanguage);

        //Mask sensitive data
        const masker = new SensitiveDataMasker();
        const maskedConfession = masker.maskText(confessionContent);

        SessionDataManager.setData(intr.user.id, 'confessionContentMasked', maskedConfession.maskedText);

        //THEME
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

        // Create a button to accept language change
        const changeLanguageButton = new ButtonBuilder()
            .setCustomId('confess-change-language-accept-button')
            .setLabel('Use detected language')
            .setStyle(ButtonStyle.Primary);

        const cancelButton = new ButtonBuilder()
            .setCustomId('confess-cancel-button')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        const changeLanguageRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(changeLanguageButton);

        const cancelRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(cancelButton);

        let maskedMessage = '';
        let otherLanguageDetectedMessage = '';
        if (maskedConfession.isMasked) {
            maskedMessage = Lang.getRef("confession-other-messages.masked",intr.locale);
        }

        if (!analysisResult.languages.includes(SessionDataManager.getData(intr.user.id, 'language'))) {
            otherLanguageDetectedMessage = Lang.getRef("confession-other-messages.other-languages",intr.locale, {DLFULLNAME: detectedLanguageFullName, DLFLAG: detectedLanguageFlag, SLFULLNAME: selectedLanguageFullName, SLFLAG: selectedLanguageFlag});
        }

        //Show the confession he typed, and the message if message has beed masked
        await intr.reply({ content: `${maskedMessage}`, embeds: [Lang.getEmbed("displayEmbeds.confession-content", intr.locale, { CONTENT: maskedConfession.maskedText })], ephemeral: true });

        if (otherLanguageDetectedMessage !== '') {
            await confessionMessage.edit({ content: `${otherLanguageDetectedMessage}`, embeds: [Lang.getEmbed("displayEmbeds.confession-theme", intr.locale)], components: [selectMenu,cancelRow, changeLanguageRow] });
        }
        else {
            await confessionMessage.edit({ content: "", embeds: [Lang.getEmbed("displayEmbeds.confession-theme", intr.locale)], components: [selectMenu, cancelRow] });
        }
    }
}