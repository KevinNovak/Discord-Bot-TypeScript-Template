import { ApplicationCommandData, CommandInteraction, PermissionResolvable } from 'discord.js-light';
import { EventData } from '../models/internal-models';

export interface Command {
    info: ApplicationCommandData;
    requireGuild: boolean;
    requirePerms: PermissionResolvable[];
    execute(intr: CommandInteraction, data: EventData): Promise<void>;
}
