import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import {
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    BaseCommandInteraction,
    PermissionString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../models/internal-models.js';

export interface Command {
    metadata: RESTPostAPIApplicationCommandsJSONBody;
    cooldown?: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionString[];
    autocomplete?(intr: AutocompleteInteraction, option: AutocompleteFocusedOption): Promise<void>;
    execute(intr: BaseCommandInteraction, data: EventData): Promise<void>;
}

export enum CommandDeferType {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
    NONE = 'NONE',
}
