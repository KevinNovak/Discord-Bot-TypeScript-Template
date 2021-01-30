import { Message } from 'discord.js-light';

import { LangCode } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class InfoCommand implements Command {
    public requireGuild = false;
    public requirePerms = [];

    public keyword(langCode: LangCode): string {
        return Lang.getRef('commands.info', langCode);
    }

    public regex(langCode: LangCode): RegExp {
        return Lang.getRegex('commands.info', langCode);
    }

    public async execute(msg: Message, args: string[], data: EventData): Promise<void> {
        await MessageUtils.send(msg.channel, Lang.getEmbed('displays.info', data.lang()));
    }
}
