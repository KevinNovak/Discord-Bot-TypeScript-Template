import axios from 'axios';
import * as cheerio from 'cheerio';
import { Message } from 'discord.js';
import stream from 'node:stream';

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

        // If Harrison or Quinn messages a strong CSV, upload it to their personal servers
        if (msg.attachments.size > 0) {
            try {
                handleStrongCSVUpload(msg);
            } catch (err) {
                Logger.error('Error handling strong CSV upload', err);
            }
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

/**
 * Uploads a strong CSV export to Harrison or Quinn's personal servers.
 * @param msg Discord Message
 */
const handleStrongCSVUpload = async (msg: Message): Promise<void> => {
    for (const attachment of msg.attachments.values()) {
        if (!attachment.url.endsWith('strong.csv')) {
            return;
        }

        if (msg.author.displayName !== 'nanasparty' && msg.author.displayName !== 'qshannn') {
            return;
        }

        const response = await axios({
            method: 'get',
            url: attachment.url,
            responseType: 'stream',
        });

        const passThrough = new stream.PassThrough();
        response.data.pipe(passThrough);

        const url =
            msg.author.displayName === 'nanasparty'
                ? 'https://lifts.hborg.org/upload-lifts'
                : 'https://lifts.quinn.io/upload-lifts';

        const uploadResponse = await axios.post(url, passThrough, {
            headers: {
                'Content-Type': 'text/csv',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        stream.finished(uploadResponse.data, err => {
            if (err) {
                Logger.error(`Error uploading CSV file to ${url}`, err);
            } else {
                Logger.info(`CSV file uploaded successfully to ${url}`);
            }
        });
    }
};

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
