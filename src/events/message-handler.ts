import { Message } from 'discord.js';

import { EventHandler, TriggerHandler } from '.';

export class MessageHandler implements EventHandler {
    constructor(private triggerHandler: TriggerHandler) {}

    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user.id) {
            return;
        }

        // Process command
        let args = msg.content.split(' ');
        await this.triggerHandler.process(msg, args);
    }
}
