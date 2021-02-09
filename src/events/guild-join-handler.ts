import { Guild } from 'discord.js-light';
import { LangCode } from '../models/enums';

import { Lang, Logger } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { EventHandler } from './event-handler';

let Logs = require('../../lang/logs.json');

export class GuildJoinHandler implements EventHandler {
    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildJoined
                .replace('{GUILD_NAME}', guild.name)
                .replace('{GUILD_ID}', guild.id)
        );

        // Get welcome message
        // TODO: Get appropriate language if we have the data, guild lang? owner lang?
        let embed = Lang.getEmbed('displays.welcome', LangCode.EN_US).setAuthor(
            guild.name,
            guild.iconURL()
        );

        // Send to notify channel
        let notifyChannel = await ClientUtils.findNotifyChannel(guild);
        if (notifyChannel) {
            await MessageUtils.send(notifyChannel, embed);
        }

        // Send to owner
        if (guild.owner) {
            await MessageUtils.send(guild.owner.user, embed);
        }
    }
}
