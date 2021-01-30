import { Message } from 'discord.js-light';

import { LangCode } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

export class HelpCommand implements Command {
    public requireGuild = false;
    public requirePerms = [];

    public keyword(langCode: LangCode): string {
        return Lang.getRef('commands.help', langCode);
    }

    public regex(langCode: LangCode): RegExp {
        return Lang.getRegex('commands.help', langCode);
    }

    public async execute(msg: Message, args: string[], data: EventData): Promise<void> {
        await MessageUtils.send(msg.channel, Lang.getEmbed('displays.help', data.lang()));
    }
}
