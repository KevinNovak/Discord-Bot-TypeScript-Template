import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';

import { Command, CommandDeferType } from '.';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';

export class InfoCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: Lang.getCom('commands.info'),
        description: Lang.getRef('commandDescs.info', Lang.Default),
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireGuild = false;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await MessageUtils.sendIntr(intr, Lang.getEmbed('displayEmbeds.info', data.lang()));
    }
}
