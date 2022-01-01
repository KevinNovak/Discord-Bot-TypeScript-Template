import { ApplicationCommandData, CommandInteraction, PermissionResolvable } from 'discord.js';
import { EventData } from '../models/internal-models';

export interface Command {
    metadata: ApplicationCommandData;
    requireDev: boolean;
    requireGuild: boolean;
    requireUserPerms: PermissionResolvable[];
    execute(intr: CommandInteraction, data: EventData): Promise<void>;
}
