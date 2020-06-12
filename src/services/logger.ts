import { DiscordAPIError } from 'discord.js';
import { StatusCodeError } from 'request-promise/errors';

export class Logger {
    private static shardTag: string;

    public static info(message: string): void {
        let log = '[Info]';
        if (this.shardTag) {
            log += ' ' + this.shardTag;
        }
        log += ' ' + message;
        console.log(log);
    }

    public static warn(message: string): void {
        let log = '[Warn]';
        if (this.shardTag) {
            log += ' ' + this.shardTag;
        }
        log += ' ' + message;
        console.warn(log);
    }

    public static error(message: string, error?: any): void {
        // Log custom error message
        let log = '[Error]';
        if (this.shardTag) {
            log += ' ' + this.shardTag;
        }
        log += ' ' + message;
        console.error(log);

        // Log error object if exists
        if (!error) {
            return;
        }

        switch (error.constructor) {
            case StatusCodeError:
                console.error({
                    statusCode: error.statusCode,
                    stack: error.stack,
                });
                break;
            case DiscordAPIError:
                console.error({
                    message: error.message,
                    code: error.code,
                    statusCode: error.httpStatus,
                    method: error.method,
                    path: error.path,
                    stack: error.stack,
                });
                break;
            default:
                console.error(error);
                break;
        }
    }

    public static setShardId(shardId: number): void {
        if (shardId > -1) {
            this.shardTag = `[Shard ${shardId.toString()}]`;
        }
    }
}
