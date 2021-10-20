import { ActivityType, Client, ClientOptions, Presence } from 'discord.js';

export class CustomClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions);
    }

    public setPresence(type: ActivityType, name: string, url: string): Presence {
        return this.user?.setPresence({
            activities: [
                {
                    // TODO: Discord.js won't accept all ActivityType's here
                    // Need to find a solution to remove "any"
                    type: type as any,
                    name,
                    url,
                },
            ],
        });
    }
}
