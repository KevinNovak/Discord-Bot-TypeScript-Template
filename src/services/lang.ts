import { MessageEmbed } from 'discord.js';
import { MultilingualService } from 'discord.js-multilingual-utils';
import path from 'path';

export class Lang {
    private static multilingualService: MultilingualService = new MultilingualService(
        path.resolve(__dirname, '../../lang')
    );

    public static getRef(
        refName: string,
        langCode: string,
        variables?: { [name: string]: string }
    ): string {
        return this.multilingualService.getRef(refName, langCode, variables);
    }

    public static getEmbed(
        embedName: string,
        langCode: string,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        return this.multilingualService.getEmbed(embedName, langCode, variables);
    }
}
