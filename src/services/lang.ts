import { MessageEmbed } from 'discord.js';
import { MultilingualService } from 'discord.js-multilingual-utils';
import path from 'path';

import { LangCode } from '../models/enums';

export class Lang {
    private static multilingualService: MultilingualService = new MultilingualService(
        path.resolve(__dirname, '../../lang')
    );

    public static getEmbed(
        embedName: string,
        langCode: LangCode,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        return this.multilingualService.getEmbed(embedName, langCode, variables);
    }

    public static getRegex(regexName: string, langCode: LangCode): RegExp {
        return this.multilingualService.getRegex(regexName, langCode);
    }

    public static getRef(
        refName: string,
        langCode: LangCode,
        variables?: { [name: string]: string }
    ): string {
        return this.multilingualService.getRef(refName, langCode, variables);
    }
}
