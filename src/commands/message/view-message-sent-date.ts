import {
    ApplicationCommandType,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { MessageContextMenuInteraction, PermissionString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import moment from 'moment';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/lang.js';
import { InteractionUtils } from '../../utils/interaction-utils.js';
import { Command, CommandDeferType } from '../command.js';

export class ViewMessageSentDate implements Command {
    public metadata: RESTPostAPIContextMenuApplicationCommandsJSONBody = {
        type: ApplicationCommandType.Message,
        name: Lang.getCom('context-commands.viewMessageSentDate'),
        default_member_permissions: undefined,
    };
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];

    public async execute(intr: MessageContextMenuInteraction, data: EventData): Promise<void> {
        let message = await intr.channel.messages.fetch(intr.targetMessage.id);
        await InteractionUtils.send(
            intr,
            Lang.getEmbed('displayEmbeds.viewMessageSentDate', data.lang(), {
                DATE: moment(message.createdTimestamp).format('MMMM Do YYYY'),
            })
        );
    }
}
