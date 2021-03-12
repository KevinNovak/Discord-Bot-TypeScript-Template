import { Message } from 'discord.js-light';

import { LangCode, Language } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class TranslateCommand implements Command {
    public requireGuild = false;
    public requirePerms = [];

    public keyword(langCode: LangCode): string {
        return Lang.getRef('commands.translate', langCode);
    }

    public regex(langCode: LangCode): RegExp {
        return Lang.getRegex('commands.translate', langCode);
    }

    public async execute(msg: Message, args: string[], data: EventData): Promise<void> {
        let embed = Lang.getEmbed('displays.translate', data.lang());
        for (let langCode of Object.values(LangCode)) {
            embed.addField(Language.displayName(langCode), Language.translators(langCode));
        }
        await MessageUtils.send(msg.channel, embed);
    }
}
