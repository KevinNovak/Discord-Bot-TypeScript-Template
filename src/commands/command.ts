import { DMChannel, Message, TextChannel } from 'discord.js';

export interface Command {
    name: string;
    aliases: string[];
    requireGuild: boolean;
    execute(args: string[], msg: Message, channel: DMChannel | TextChannel): Promise<void>;
}
