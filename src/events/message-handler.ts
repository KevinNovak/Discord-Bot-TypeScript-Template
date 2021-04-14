import { DMChannel, GuildChannel, Message, TextBasedChannel } from 'discord.js-light';

import { EventHandler, TriggerHandler } from '.';

export class MessageHandler implements EventHandler {
    constructor(private triggerHandler: TriggerHandler) {}

    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user.id) {
            return;
        }

        // Only handle messages from the following channel types
        if (
            !(
                msg.channel instanceof DMChannel ||
                msg.channel instanceof TextBasedChannel(GuildChannel)
            )
        ) {
            return;
        }

        // Process command
        let args = msg.content.split(' ');
        await this.triggerHandler.process(msg, args);
    }
}
