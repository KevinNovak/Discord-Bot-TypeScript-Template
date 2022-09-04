import { Locale, LocalizationMap } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';
import { Linguini, TypeMapper, TypeMappers, Utils } from 'linguini';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Language } from '../models/enum-helpers/language.js';

export class Lang {
    private static linguini = new Linguini(
        path.resolve(dirname(fileURLToPath(import.meta.url)), '../../lang'),
        'lang'
    );

    public static getEmbed(
        location: string,
        langCode: Locale,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        return (
            this.linguini.get(location, langCode, this.messageEmbedTm, variables) ??
            this.linguini.get(location, Language.Default, this.messageEmbedTm, variables)
        );
    }

    public static getRegex(location: string, langCode: Locale): RegExp {
        return (
            this.linguini.get(location, langCode, TypeMappers.RegExp) ??
            this.linguini.get(location, Language.Default, TypeMappers.RegExp)
        );
    }

    public static getRef(
        location: string,
        langCode: Locale,
        variables?: { [name: string]: string }
    ): string {
        return (
            this.linguini.getRef(location, langCode, variables) ??
            this.linguini.getRef(location, Language.Default, variables)
        );
    }

    public static getRefLocalizationMap(
        location: string,
        variables?: { [name: string]: string }
    ): LocalizationMap {
        let obj = {};
        for (let langCode of Language.Enabled) {
            obj[langCode] = this.getRef(location, langCode, variables);
        }
        return obj;
    }

    public static getCom(location: string, variables?: { [name: string]: string }): string {
        return this.linguini.getCom(location, variables);
    }

    private static messageEmbedTm: TypeMapper<MessageEmbed> = (jsonValue: any) => {
        return new MessageEmbed({
            author: jsonValue.author,
            title: Utils.join(jsonValue.title, '\n'),
            url: jsonValue.url,
            thumbnail: {
                url: jsonValue.thumbnail,
            },
            description: Utils.join(jsonValue.description, '\n'),
            fields: jsonValue.fields?.map(field => ({
                name: Utils.join(field.name, '\n'),
                value: Utils.join(field.value, '\n'),
                inline: field.inline ? field.inline : false,
            })),
            image: {
                url: jsonValue.image,
            },
            footer: {
                text: Utils.join(jsonValue.footer?.text, '\n'),
                iconURL: jsonValue.footer?.icon,
            },
            timestamp: jsonValue.timestamp ? Date.now() : undefined,
            color: jsonValue.color ?? Lang.getCom('colors.default'),
        });
    };
}
