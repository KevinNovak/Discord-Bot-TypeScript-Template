import djs, { Message } from 'discord.js';
import typescript from 'typescript';

import { LangCode } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';
import { Command } from './command';

let TsConfig = require('../../tsconfig.json');

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
        await MessageUtils.send(msg.channel, Lang.getEmbed('commands.info', data.lang()));
    }
}
