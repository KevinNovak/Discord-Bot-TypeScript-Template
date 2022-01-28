import { ChatInputApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './index.js';

export class HelpCommand implements Command {
    public metadata: ChatInputApplicationCommandData = {
        name: Lang.getCom('commands.help'),
        description: Lang.getRef('commandDescs.help', Lang.Default),
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireGuild = false;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.help', data.lang()));
    }
}
