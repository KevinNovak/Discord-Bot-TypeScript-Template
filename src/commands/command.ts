import { Message, PermissionResolvable } from 'discord.js';

export interface Command {
    name: string;
    aliases: string[];
    requireGuild: boolean;
    requirePerms: PermissionResolvable[];
    execute(msg: Message, args: string[]): Promise<void>;
}
