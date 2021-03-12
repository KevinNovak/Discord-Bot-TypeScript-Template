import { Guild } from 'discord.js-light';

import { LangCode } from '../models/enums';
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
        // let data = new EventData();

        // Send welcome message to the server's notify channel
        // TODO: Replace "EN_US" here with the server's language
        let guildLang = LangCode.EN_US;
        let notifyChannel = await ClientUtils.findNotifyChannel(guild, guildLang);
        if (notifyChannel) {
            await MessageUtils.send(
                notifyChannel,
                Lang.getEmbed('displays.welcome', guildLang).setAuthor(guild.name, guild.iconURL())
            );
        }

        // Send welcome message to owner
        // TODO: Replace "EN_US" here with the owner's language
        let ownerLang = LangCode.EN_US;
        if (guild.owner) {
            await MessageUtils.send(
                guild.owner.user,
                Lang.getEmbed('displays.welcome', ownerLang).setAuthor(guild.name, guild.iconURL())
            );
        }
    }
}
