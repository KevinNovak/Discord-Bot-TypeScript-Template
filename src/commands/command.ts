import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../models/internal-models';

export interface Command {
    metadata: ApplicationCommandData;
    cooldown?: RateLimiter;
    requireDev: boolean;
    requireGuild: boolean;
    requireClientPerms: PermissionString[];
    requireUserPerms: PermissionString[];
    execute(intr: CommandInteraction, data: EventData): Promise<void>;
}
