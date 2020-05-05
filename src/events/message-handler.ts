import { Message } from 'discord.js';

export class MessageHandler {
    constructor(private prefix: string) {}

    public async process(msg: Message): Promise<void> {
        if (msg.content.toLowerCase().startsWith(this.prefix)) {
            msg.channel.send('It works!');
        }
    }
}
