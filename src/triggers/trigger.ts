import { Message } from 'discord.js-light';
import { EventData } from '../models/internal-models';

export interface Trigger {
    requireGuild: boolean;
    triggered(msg: Message, args: string[]): boolean;
    execute(msg: Message, args: string[], data: EventData): Promise<void>;
}
