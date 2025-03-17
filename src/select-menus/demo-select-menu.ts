import { EmbedBuilder, StringSelectMenuInteraction } from 'discord.js';
import { EventData } from '../models/internal-models.js';
import { InteractionUtils } from '../utils/index.js';
import { SelectMenu, SelectMenuDeferType } from './index.js';

export class DemoSelectMenu implements SelectMenu {
    public ids = ['demo-select'];
    public deferType = SelectMenuDeferType.NONE;
    public requireGuild = false;

    public async execute(intr: StringSelectMenuInteraction, data: EventData): Promise<void> {
        const selected = intr.values[0];
        
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Selection Result')
            .setDescription(`You selected: ${selected}`)
            .setTimestamp();
        
        await InteractionUtils.update(intr, { embeds: [embed], components: [] });
    }
}