import { ButtonInteraction } from 'discord.js';
import { Button, ButtonDeferType } from './button.js';
import { SessionDataManager } from '../services/index.js';

export class GuildConfessionButton implements Button {
    public ids = ['confess-guild-button'];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    public async execute(intr: ButtonInteraction): Promise<void> {
        SessionDataManager.clearData(intr.user.id);
        intr.editReply("???");
    }
}