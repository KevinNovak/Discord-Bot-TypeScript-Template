import { Guild } from 'discord.js-light';

import { Logger } from '../services';
import { EventHandler } from './event-handler';

let Logs = require('../../lang/logs.json');

export class GuildLeaveHandler implements EventHandler {
    public async process(guild: Guild): Promise<void> {
        Logger.info(
            Logs.info.guildLeft.replace('{GUILD_NAME}', guild.name).replace('{GUILD_ID}', guild.id)
        );
    }
}
