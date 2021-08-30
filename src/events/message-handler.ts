import { Message } from 'discord.js';

import { CommandHandler, EventHandler, TriggerHandler } from '.';

export class MessageHandler implements EventHandler {
    constructor(private commandHandler: CommandHandler, private triggerHandler: TriggerHandler) {}

    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user.id) {
            return;
        }

        // Process command
        let args = msg.content.split(' ');
        if (this.commandHandler.shouldHandle(msg, args)) {
            await this.commandHandler.process(msg, args);
            return;
        }

        // Process triggers
        await this.triggerHandler.process(msg);
    }
}
