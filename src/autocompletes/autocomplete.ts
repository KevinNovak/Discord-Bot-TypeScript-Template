import {
    ApplicationCommandOptionChoiceData,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
} from 'discord.js';

import { EventData } from '../models/internal-models.js';

export interface Autocomplete {
    name: string;
    minLength: number;
    execute(
        intr: AutocompleteInteraction,
        option: AutocompleteFocusedOption,
        data: EventData
    ): Promise<ApplicationCommandOptionChoiceData[]>;
}
