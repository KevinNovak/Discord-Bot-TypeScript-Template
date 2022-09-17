import { Locale } from 'discord-api-types/v10.js';
import { Channel, Guild, PartialDMChannel, User } from 'discord.js';

import { Language } from '../models/enum-helpers/language.js';
import { EventData } from '../models/internal-models.js';

export class EventDataService {
    public async create(
        options: {
            user?: User;
            channel?: Channel | PartialDMChannel;
            guild?: Guild;
        } = {}
    ): Promise<EventData> {
        // User language
        let langUser =
            options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale as Locale)
                ? (options.guild.preferredLocale as Locale)
                : Language.Default;

        // Guild language
        let langGuild =
            options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale as Locale)
                ? (options.guild.preferredLocale as Locale)
                : Language.Default;

        // TODO: Retrieve any data you want to pass along in events

        return new EventData(langUser, langGuild);
    }
}
