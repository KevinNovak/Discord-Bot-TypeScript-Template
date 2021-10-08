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
        let embed = new MessageEmbed({ color: '#0099ff' });

        let author = jsonValue.author;
        if (author?.name) {
            embed.setAuthor(author.name, author.icon, author.url);
        }

        let title = this.join(jsonValue.title, '\n');
        if (title) {
            embed.setTitle(title);
        }

        let url = jsonValue.url;
        if (url) {
            embed.setURL(url);
        }

        let thumbnail = jsonValue.thumbnail;
        if (thumbnail) {
            embed.setThumbnail(thumbnail);
        }

        let description = this.join(jsonValue.description, '\n');
        if (description) {
            embed.setDescription(description);
        }

        let fields = jsonValue.fields;
        if (fields) {
            for (let field of fields) {
                field.name = this.join(field.name, '\n');
                field.value = this.join(field.value, '\n');
                if (field.inline !== undefined) {
                    embed.addField(field.name, field.value, field.inline);
                } else {
                    embed.addField(field.name, field.value);
                }
            }
        }

        let image = jsonValue.image;
        if (image) {
            embed.setImage(image);
        }

        let footer = jsonValue.footer;
        let footerText = this.join(footer?.text, '\n');
        let footerIcon = footer?.icon;
        if (footerText && footerIcon) {
            embed.setFooter(footerText, footerIcon);
        } else if (footerText) {
            embed.setFooter(footerText);
        }

        // TODO: Allow date or number timestamp
        let timestamp = jsonValue.timestamp;
        if (timestamp) {
            embed.setTimestamp();
        }

        let color = jsonValue.color;
        if (color) {
            embed.setColor(color);
        }

        return embed;
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
