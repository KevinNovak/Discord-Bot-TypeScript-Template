import { User } from 'discord.js';

export interface EventHandler {
    process(event: any, user?: User): Promise<void>;
}
