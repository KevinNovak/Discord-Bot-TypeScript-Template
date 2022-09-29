import {
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    CommandInteraction,
    PermissionsString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../models/internal-models.js';

export interface Command {
    names: string[];
    cooldown?: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    autocomplete?(intr: AutocompleteInteraction, option: AutocompleteFocusedOption): Promise<void>;
    execute(intr: CommandInteraction, data: EventData): Promise<void>;
}

export enum CommandDeferType {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
    NONE = 'NONE',
}
