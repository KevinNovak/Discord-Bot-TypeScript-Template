import { DMChannel, Message, TextChannel } from 'discord.js-light';

import { TriggerHandler } from '.';
import { EventHandler } from './event-handler';

export class MessageHandler implements EventHandler {
    constructor(private triggerHandler: TriggerHandler) {}

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
        await this.triggerHandler.process(msg, args);
    }
}
