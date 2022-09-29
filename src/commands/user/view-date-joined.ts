import { DMChannel, PermissionsString, UserContextMenuCommandInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class ViewDateJoined implements Command {
    public names = [Lang.getRef('userCommands.viewDateJoined', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: UserContextMenuCommandInteraction, data: EventData): Promise<void> {
        let joinDate: Date;
        if (!(intr.channel instanceof DMChannel)) {
            let member = await intr.guild.members.fetch(intr.targetUser.id);
            joinDate = member.joinedAt;
        } else joinDate = intr.targetUser.createdAt;

        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.viewDateJoined', data.lang, {
                TARGET: intr.targetUser.toString(),
                DATE: DateTime.fromJSDate(joinDate).toLocaleString(DateTime.DATE_HUGE),
            })
        );
    }
}
