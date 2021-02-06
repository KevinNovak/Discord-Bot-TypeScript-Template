import { User } from 'discord.js-light';

export interface EventHandler {
    process(event: any, user?: User): Promise<void>;
}
