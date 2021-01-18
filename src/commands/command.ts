import { Message, PermissionResolvable } from 'discord.js';
import { Keyword } from '../models/common';
import { EventData } from '../models/internal-models';

export interface Command extends Keyword {
    requireGuild: boolean;
    requirePerms: PermissionResolvable[];
    execute(msg: Message, args: string[], data: EventData): Promise<void>;
}
