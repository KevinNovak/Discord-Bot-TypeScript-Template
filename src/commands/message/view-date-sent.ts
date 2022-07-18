import {
    ApplicationCommandType,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { Message, MessageContextMenuInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { DateTime } from 'luxon';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class ViewDateSent implements Command {
    public metadata: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
        type: ApplicationCommandType.Message,
        name: Lang.getCom('messageCommands.viewDateSent'),
        default_member_permissions: undefined,
        dm_permission: true,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: MessageContextMenuInteraction, data: EventData): Promise<void> {
        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.viewDateSent', data.lang(), {
                DATE: DateTime.fromJSDate((intr.targetMessage as Message).createdAt).toLocaleString(
                    DateTime.DATE_HUGE
                ),
            })
        );
    }
}
