import { DMChannel, Message, TextChannel } from 'discord.js-light';

import { CommandHandler, TriggerHandler } from '.';

export class MessageHandler {
    constructor(private commandHandler: CommandHandler, private triggerHandler: TriggerHandler) {}

    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user.id) {
            return;
        }

        // Only handle messages from text or DM channels
        if (!(msg.channel instanceof TextChannel || msg.channel instanceof DMChannel)) {
            return;
        }

        // Process command
        let args = msg.content.split(' ');
        if (this.commandHandler.shouldHandle(msg, args)) {
            await this.commandHandler.process(msg, args);
            return;
        }

        // Process triggers
        await this.triggerHandler.process(msg, args);
    }
}
