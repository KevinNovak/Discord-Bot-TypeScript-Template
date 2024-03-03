import axios from 'axios';
import * as cheerio from 'cheerio';
import { Message } from 'discord.js';

import { EventHandler, TriggerHandler } from './index.js';
import { Logger } from '../services/index.js';
import { MessageUtils } from '../utils/index.js';

export class MessageHandler implements EventHandler {
    constructor(private triggerHandler: TriggerHandler) {}

    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user?.id) {
            return;
        }

        const urlRegex = /https:\/\/www\.xbox\.com\/play\/media\/(.+)/;
        // Reading msg.content requires the intent and toggle on in the bot settings
        const matches = msg.content.match(urlRegex);

        if (matches) {
            Logger.info('Xbox media URL detected');
            const url = matches[0];
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const videoSrc = $('video').attr('src');

            if (videoSrc) {
                const formattedMessage = `[Video Link](${videoSrc})`;
                await MessageUtils.send(msg.channel, formattedMessage);
                // Delete the original message
                await msg.delete();
                return;
            }
        }
        // Process trigger
        await this.triggerHandler.process(msg);
    }
}
