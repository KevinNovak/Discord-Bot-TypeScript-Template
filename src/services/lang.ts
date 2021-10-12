import { MessageEmbed } from 'discord.js';
import { Linguini, TypeMapper } from 'linguini';
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
            this.linguini.get(location, langCode, this.regExpTm) ??
            this.linguini.get(location, this.Default, this.regExpTm)
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

    private static messageEmbedTm: TypeMapper<MessageEmbed> = (jsonValue: any) => {
        return new MessageEmbed({
            author: jsonValue.author,
            title: this.join(jsonValue.title, '\n'),
            url: jsonValue.url,
            thumbnail: jsonValue.thumbnail,
            description: this.join(jsonValue.description, '\n'),
            fields: jsonValue.fields?.map(field => ({
                name: this.join(field.name, '\n'),
                value: this.join(field.value, '\n'),
            })),
            image: jsonValue.image,
            footer: {
                text: this.join(jsonValue.footer?.text, '\n'),
                iconURL: this.join(jsonValue.footer?.icon, '\n'),
            },
            timestamp: jsonValue.timestamp ? Date.now() : undefined,
            color: jsonValue.color ?? '#0099ff',
        });
    };

    private static regExpTm: TypeMapper<RegExp> = (jsonValue: any) => {
        let match = /^\/(.*)\/([^\/]*)$/.exec(jsonValue);
        if (!match) {
            return;
        }

        return new RegExp(match[1], match[2]);
    };

    private static join(input: string | string[], separator: string): string {
        return input instanceof Array ? input.join('\n') : input;
    }
}
