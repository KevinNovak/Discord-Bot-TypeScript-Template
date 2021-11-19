import { ApplicationCommandData, CommandInteraction } from 'discord.js';

import { LangCode, Language } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class TranslateCommand implements Command {
    public data: ApplicationCommandData = {
        name: Lang.getCom('commands.translate'),
        description: Lang.getRef('commandDescs.translate', Lang.Default),
    };
    public requireDev = false;
    public requireGuild = false;
    public requirePerms = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let embed = Lang.getEmbed('displayEmbeds.translate', data.lang());
        for (let langCode of Object.values(LangCode)) {
            embed.addField(Language.displayName(langCode), Language.translators(langCode));
        }
        await MessageUtils.sendIntr(intr, embed);
    }
}
