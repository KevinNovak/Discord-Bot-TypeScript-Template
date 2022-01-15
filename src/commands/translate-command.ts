import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';

import { Command, CommandDeferType } from '.';
import { LangCode, Language } from '../models/enums';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { MessageUtils } from '../utils';

export class TranslateCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: Lang.getCom('commands.translate'),
        description: Lang.getRef('commandDescs.translate', Lang.Default),
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireGuild = false;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        let embed = Lang.getEmbed('displayEmbeds.translate', data.lang());
        for (let langCode of Object.values(LangCode)) {
            embed.addField(Language.displayName(langCode), Language.translators(langCode));
        }
        await MessageUtils.sendIntr(intr, embed);
    }
}
