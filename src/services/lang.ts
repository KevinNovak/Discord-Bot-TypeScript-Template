import { MessageEmbed } from 'discord.js';
import { join, Linguini, regExpTm, TypeMapper } from 'linguini';
import path from 'path';

import { LangCode } from '../models/enums';

export class Lang {
    public static Default = LangCode.EN_US;

    private static linguini = new Linguini(path.resolve(__dirname, '../../lang'), 'lang');

    public static getEmbed(
        location: string,
        langCode: LangCode,
        variables?: { [name: string]: string }
    ): MessageEmbed {
        return (
            this.linguini.get(location, langCode, this.messageEmbedTm, variables) ??
            this.linguini.get(location, this.Default, this.messageEmbedTm, variables)
        );
    }

    public static getRegex(location: string, langCode: LangCode): RegExp {
        return (
            this.linguini.get(location, langCode, regExpTm) ??
            this.linguini.get(location, this.Default, regExpTm)
        );
    }

    public static getRef(
        location: string,
        langCode: LangCode,
        variables?: { [name: string]: string }
    ): string {
        return (
            this.linguini.getRef(location, langCode, variables) ??
            this.linguini.getRef(location, this.Default, variables)
        );
    }

    public static getCom(location: string, variables?: { [name: string]: string }): string {
        return this.linguini.getCom(location, variables);
    }

    private static messageEmbedTm: TypeMapper<MessageEmbed> = (jsonValue: any) => {
        return new MessageEmbed({
            author: jsonValue.author,
            title: join(jsonValue.title, '\n'),
            url: jsonValue.url,
            thumbnail: jsonValue.thumbnail,
            description: join(jsonValue.description, '\n'),
            fields: jsonValue.fields?.map(field => ({
                name: join(field.name, '\n'),
                value: join(field.value, '\n'),
            })),
            image: jsonValue.image,
            footer: {
                text: join(jsonValue.footer?.text, '\n'),
                iconURL: join(jsonValue.footer?.icon, '\n'),
            },
            timestamp: jsonValue.timestamp ? Date.now() : undefined,
            color: jsonValue.color ?? '#0099ff',
        });
    };
}
