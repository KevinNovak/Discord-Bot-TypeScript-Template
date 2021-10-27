import { DiscordAPIError } from 'discord.js';
import { Response } from 'node-fetch';
import pino from 'pino';

let Config = require('../../config/config.json');

let logger = pino(
    {
        formatters: {
            level: label => {
                return { level: label };
            },
        },
    },
    Config.logging.pretty
        ? pino.transport({
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  ignore: 'pid,hostname',
                  translateTime: 'yyyy-mm-dd HH:MM:ss.l',
              },
          })
        : undefined
);

export class Logger {
    private static shardId: number;

    public static info(message: string): void {
        logger.info(message);
    }

    public static warn(message: string): void {
        logger.warn(message);
    }

    public static async error(message: string, error?: any): Promise<void> {
        // Log just a message if no error object
        if (!error) {
            logger.error(message);
            return;
        }

        // Otherwise log details about the error
        switch (error.constructor) {
            case Response: {
                let res = error as Response;
                let resText: string;
                try {
                    resText = await res.text();
                } catch {
                    // Ignore
                }
                logger
                    .child({
                        path: res.url,
                        statusCode: res.status,
                        statusName: res.statusText,
                        headers: res.headers.raw(),
                        body: resText,
                    })
                    .error(message);
                break;
            }
            case DiscordAPIError: {
                let discordError = error as DiscordAPIError;
                logger
                    .child({
                        message: discordError.message,
                        code: discordError.code,
                        statusCode: discordError.httpStatus,
                        method: discordError.method,
                        path: discordError.path,
                        stack: discordError.stack,
                    })
                    .error(message);
                break;
            }
            default: {
                logger.error(error, message);
                break;
            }
        }
    }

    public static setShardId(shardId: number): void {
        if (this.shardId !== shardId) {
            this.shardId = shardId;
            logger = logger.child({ shardId });
        }
    }
}
