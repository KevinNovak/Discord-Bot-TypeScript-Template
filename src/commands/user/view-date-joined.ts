import {
    ApplicationCommandType,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { DMChannel, PermissionString, UserContextMenuInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/lang.js';
import { InteractionUtils } from '../../utils/interaction-utils.js';
import { Command, CommandDeferType } from '../command.js';

export class ViewDateJoined implements Command {
    public metadata: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
        type: ApplicationCommandType.User,
        name: Lang.getCom('userCommands.viewDateJoined'),
        default_member_permissions: undefined,
        dm_permission: true,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: UserContextMenuInteraction, data: EventData): Promise<void> {
        let joinDate: Date;
        if (!(intr.channel instanceof DMChannel)) {
            let member = await intr.guild.members.fetch(intr.targetUser.id);
            joinDate = member.joinedAt;
        } else joinDate = intr.targetUser.createdAt;

        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.viewDateJoined', data.lang(), {
                TARGET: intr.targetUser.toString(),
                DATE: DateTime.fromJSDate(joinDate).toLocaleString(DateTime.DATE_HUGE),
            })
        );
    }
}
