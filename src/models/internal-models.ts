import { Locale } from 'discord-api-types/v10';

// This class is used to store and pass data along in events
export class EventData {
    // TODO: Add any data you want to store
    constructor(private userLang: Locale, private guildLang: Locale) {}

    // User language
    public lang(): Locale {
        return this.userLang;
    }

    // Guild language
    public langGuild(): Locale {
        return this.guildLang;
    }
}
