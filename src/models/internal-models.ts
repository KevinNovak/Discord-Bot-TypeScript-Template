import { Locale } from 'discord-api-types/v10';
import { Guild } from 'discord.js';

import { Language } from './enum-helpers/index.js';

// This class is used to store and pass data along in events
export class EventData {
    private guildPrimaryLocale?: Locale;

    public async initialize(guild?: Guild): Promise<EventData> {
        if (guild) {
            // TODO: Retrieve guild data from the database and save to this object
            let locale = guild.preferredLocale as Locale;
            if (Language.Enabled.includes(locale)) {
                this.guildPrimaryLocale = locale;
            }
        }

        // TODO: Retrieve any other data you want to pass along in events

        return this;
    }

    public lang(): Locale {
        // TODO: Calculate language
        return this.guildPrimaryLocale ?? Language.Default;
    }
}
