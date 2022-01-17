import { DiscordAPIError } from 'discord.js';
import { Response } from 'node-fetch';
import { createRequire } from 'node:module';
import pino from 'pino';

const require = createRequire(import.meta.url);
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
        if (error instanceof Response) {
            let resText: string;
            try {
                resText = await error.text();
            } catch {
                // Ignore
            }
            logger
                .child({
                    path: error.url,
                    statusCode: error.status,
                    statusName: error.statusText,
                    headers: error.headers.raw(),
                    body: resText,
                })
                .error(message);
        } else if (error instanceof DiscordAPIError) {
            logger
                .child({
                    message: error.message,
                    code: error.code,
                    statusCode: error.httpStatus,
                    method: error.method,
                    path: error.path,
                    stack: error.stack,
                })
                .error(message);
        } else {
            logger.error(error, message);
        }
    }

    public static setShardId(shardId: number): void {
        if (this.shardId !== shardId) {
            this.shardId = shardId;
            logger = logger.child({ shardId });
        }
    }
}
