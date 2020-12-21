import { DMChannel, Message, PermissionResolvable, TextChannel } from 'discord.js';

export interface Command {
    name: string;
    aliases: string[];
    requireGuild: boolean;
    requirePerms: PermissionResolvable[];
    execute(args: string[], msg: Message, channel: DMChannel | TextChannel): Promise<void>;
}
