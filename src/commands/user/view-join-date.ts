import {
    ApplicationCommandType,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { PermissionString, UserContextMenuInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/lang.js';
import { InteractionUtils } from '../../utils/interaction-utils.js';
import { Command, CommandDeferType } from '../command.js';

export class ViewJoinDate implements Command {
    public metadata: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
        type: ApplicationCommandType.User,
        name: Lang.getCom('contextCommands.viewJoinDate'),
        default_member_permissions: undefined,
        dm_permission: true,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: UserContextMenuInteraction, data: EventData): Promise<void> {
        let member = await intr.guild.members.fetch(intr.targetUser.id);
        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.viewJoinDate', data.lang(), {
                MEMBER: member.toString(),
                DATE: DateTime.fromJSDate(member.joinedAt).toLocaleString(DateTime.DATE_HUGE),
            })
        );
    }
}
