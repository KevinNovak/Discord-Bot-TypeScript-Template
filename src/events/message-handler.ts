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
            // const proxy = getProxyConfig();
            // if (!proxy) return;
            // This bypasses the SSL certificate validation
            // const agent = new https.Agent({
            //     rejectUnauthorized: false,
            // });
            const response = await axios.get(url);
            // Check if bad response
            if (response.status !== 200) {
                Logger.error('Failed to fetch Xbox media URL', { url, status: response.status });
                return;
            }
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

// const getProxyConfig = (): AxiosProxyConfig => {
//     const password = config.proxy.password;
//
//     if (!password) {
//         Logger.info('No proxy password found. Add to the .env');
//         return null;
//     }
//
//     const host = 'brd.superproxy.io';
//     const port = 22225;
//     const username = 'brd-customer-hl_f3368662-zone-residential';
//     const session_id = randomUUID();
//
//     return {
//         host,
//         port,
//         auth: {
//             username: `${username}-session-${session_id}`,
//             password: password,
//         },
//     };
// };
