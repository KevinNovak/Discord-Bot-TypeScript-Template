import { Locale } from 'discord-api-types/v10.js';
import { Guild, User } from 'discord.js';

import { Language } from '../models/enum-helpers/language.js';
import { EventData } from '../models/internal-models.js';

export class EventDataService {
    public async create(options: { user?: User; guild?: Guild } = {}): Promise<EventData> {
        let lang =
            options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale as Locale)
                ? (options.guild.preferredLocale as Locale)
                : Language.Default;

        // TODO: Retrieve any data you want to pass along in events

        return new EventData(lang);
    }
}
