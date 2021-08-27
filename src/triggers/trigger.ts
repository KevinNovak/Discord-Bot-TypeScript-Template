import { Message } from 'discord.js';
import { EventData } from '../models/internal-models';

export interface Trigger {
    requireGuild: boolean;
    triggered(msg: Message): boolean;
    execute(msg: Message, data: EventData): Promise<void>;
}
