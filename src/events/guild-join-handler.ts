import { Guild } from 'discord.js';

import { Lang, Logger } from '../services';
import { ClientUtils, MessageUtils } from '../utils';
import { EventHandler } from './event-handler';

let Logs = require('../../lang/logs.json');

export class GuildJoinHandler implements EventHandler {
    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildJoined
                .replaceAll('{GUILD_NAME}', guild.name)
                .replaceAll('{GUILD_ID}', guild.id)
        );

        // TODO: Get data from database
        // let data = new EventData();

        // Send welcome message to the server's notify channel
        // TODO: Replace "Lang.Default" here with the server's language
        let guildLang = Lang.Default;
        let notifyChannel = await ClientUtils.findNotifyChannel(guild, guildLang);
        if (notifyChannel) {
            await MessageUtils.send(
                notifyChannel,
                Lang.getEmbed('displayEmbeds.welcome', guildLang).setAuthor(
                    guild.name,
                    guild.iconURL()
                )
            );
        }

        // Send welcome message to owner
        // TODO: Replace "Lang.Default" here with the owner's language
        let ownerLang = Lang.Default;
        let owner = await guild.fetchOwner();
        if (owner) {
            await MessageUtils.send(
                owner.user,
                Lang.getEmbed('displayEmbeds.welcome', ownerLang).setAuthor(
                    guild.name,
                    guild.iconURL()
                )
            );
        }
    }
}
