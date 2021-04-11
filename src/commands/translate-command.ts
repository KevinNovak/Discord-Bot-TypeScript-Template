import { ApplicationCommandData, CommandInteraction } from 'discord.js-light';

import { LangCode, Language } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class TranslateCommand implements Command {
    public info: ApplicationCommandData = {
        name: 'translate',
        description: 'View translation info.',
    };
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let embed = Lang.getEmbed('displays.translate', data.lang());
        for (let langCode of Object.values(LangCode)) {
            embed.addField(Language.displayName(langCode), Language.translators(langCode));
        }
        await MessageUtils.replyIntr(intr, embed);
    }
}
