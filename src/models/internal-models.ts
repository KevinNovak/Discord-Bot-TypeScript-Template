import { Locale } from 'discord-api-types/v10';

// This class is used to store and pass data along in events
export class EventData {
    // TODO: Add any data you want to store
    constructor(
        // Event language
        public lang: Locale,
        // Guild language
        public langGuild: Locale
    ) {}
}
