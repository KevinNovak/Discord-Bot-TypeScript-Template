import { DiscordAPIError } from 'discord.js';
import { Response } from 'node-fetch';

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

    public static async error(message: string, error?: any): Promise<void> {
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
            case Response:
                let response = error as Response;
                let responseText: string;
                try {
                    responseText = await response.text();
                } catch {
                    // Ignore
                }
                console.error({
                    path: response.url,
                    statusCode: response.status,
                    statusName: response.statusText,
                    body: responseText,
                });
                break;
            case DiscordAPIError:
                let discordError = error as DiscordAPIError;
                console.error({
                    message: discordError.message,
                    code: discordError.code,
                    statusCode: discordError.httpStatus,
                    method: discordError.method,
                    path: discordError.path,
                    stack: discordError.stack,
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
