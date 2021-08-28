import { CommandInteraction, PermissionResolvable } from 'discord.js';
import { EventData } from '../models/internal-models';

export interface Command {
    name: string;
    requireGuild: boolean;
    requirePerms: PermissionResolvable[];
    execute(intr: CommandInteraction, data: EventData): Promise<void>;
}
