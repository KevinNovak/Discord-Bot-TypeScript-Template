import { Guild } from 'discord.js-light';

import { EventData } from '../models/internal-models';
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

        // TODO: Get data from database
        let data = new EventData();

        // Send welcome message to notify channel
        // TODO: Replace "data.lang()" here with the server's language
        let notifyChannel = await ClientUtils.findNotifyChannel(guild, data.lang());
        if (notifyChannel) {
            await MessageUtils.send(
                notifyChannel,
                Lang.getEmbed('displays.welcome', data.lang()).setAuthor(
                    guild.name,
                    guild.iconURL()
                )
            );
        }

        // Send welcome message to owner
        // TODO: Replace "data.lang()" here with the user's language
        if (guild.owner) {
            await MessageUtils.send(
                guild.owner.user,
                await MessageUtils.send(
                    notifyChannel,
                    Lang.getEmbed('displays.welcome', data.lang()).setAuthor(
                        guild.name,
                        guild.iconURL()
                    )
                )
            );
        }
    }
}
