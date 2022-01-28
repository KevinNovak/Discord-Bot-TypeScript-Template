import { ChatInputApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../models/internal-models.js';

export interface Command {
    metadata: ChatInputApplicationCommandData;
    cooldown?: RateLimiter;
    deferType: CommandDeferType;
    requireDev: boolean;
    requireGuild: boolean;
    requireClientPerms: PermissionString[];
    requireUserPerms: PermissionString[];
    execute(intr: CommandInteraction, data: EventData): Promise<void>;
}

export enum CommandDeferType {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
    NONE = 'NONE',
}
