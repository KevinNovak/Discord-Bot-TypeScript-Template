import { ActivityType, Client, ClientOptions, Presence } from 'discord.js-light';

export class CustomClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions);
    }

    public async setPresence(type: ActivityType, name: string, url: string): Promise<Presence> {
        return await this.user?.setPresence({
            activity: {
                type,
                name,
                url,
            },
        });
    }
}
