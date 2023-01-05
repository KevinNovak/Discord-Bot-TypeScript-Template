import { ApplicationCommand, Guild, Locale } from 'discord.js';
import { filesize } from 'filesize';
import { Duration } from 'luxon';

export class FormatUtils {
    public static roleMention(guild: Guild, discordId: string): string {
        if (discordId === '@here') {
            return discordId;
        }

        if (discordId === guild.id) {
            return '@everyone';
        }

        return `<@&${discordId}>`;
    }

    public static channelMention(discordId: string): string {
        return `<#${discordId}>`;
    }

    public static userMention(discordId: string): string {
        return `<@!${discordId}>`;
    }

    // TODO: Replace with ApplicationCommand#toString() once discord.js #8818 is merged
    // https://github.com/discordjs/discord.js/pull/8818
    public static commandMention(command: ApplicationCommand, subParts: string[] = []): string {
        let name = [command.name, ...subParts].join(' ');
        return `</${name}:${command.id}>`;
    }

    public static duration(milliseconds: number, langCode: Locale): string {
        return Duration.fromObject(
            Object.fromEntries(
                Object.entries(
                    Duration.fromMillis(milliseconds, { locale: langCode })
                        .shiftTo(
                            'year',
                            'quarter',
                            'month',
                            'week',
                            'day',
                            'hour',
                            'minute',
                            'second'
                        )
                        .toObject()
                ).filter(([_, value]) => !!value) // Remove units that are 0
            )
        ).toHuman({ maximumFractionDigits: 0 });
    }

    public static fileSize(bytes: number): string {
        return filesize(bytes, { output: 'string', pad: true, round: 2 }).toString();
    }
}
