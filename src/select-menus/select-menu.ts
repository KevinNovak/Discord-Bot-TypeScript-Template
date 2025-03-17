import { StringSelectMenuInteraction } from 'discord.js';

import { EventData } from '../models/internal-models.js';

export interface SelectMenu {
    ids: string[];
    deferType: SelectMenuDeferType;
    requireGuild: boolean;
    execute(intr: StringSelectMenuInteraction, data: EventData): Promise<void>;
}

export enum SelectMenuDeferType {
    REPLY = 'REPLY',
    UPDATE = 'UPDATE',
    NONE = 'NONE',
}