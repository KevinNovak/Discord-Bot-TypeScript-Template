import { MessageReaction, User } from 'discord.js';

import { EventData } from '../models/internal-models';

export interface Reaction {
    emoji: string;
    requireGuild: boolean;
    execute(msgReaction: MessageReaction, reactor: User, data: EventData): Promise<void>;
}
