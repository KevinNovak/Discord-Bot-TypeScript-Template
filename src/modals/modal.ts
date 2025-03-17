import { ModalSubmitInteraction } from 'discord.js';

import { EventData } from '../models/internal-models.js';

export interface Modal {
    ids: string[];
    deferType: ModalDeferType;
    requireGuild: boolean;
    execute(intr: ModalSubmitInteraction, data: EventData): Promise<void>;
}

export enum ModalDeferType {
    REPLY = 'REPLY',
    UPDATE = 'UPDATE',
    NONE = 'NONE',
}