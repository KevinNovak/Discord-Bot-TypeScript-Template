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
        let log = '[Error]';
        if (this.shardTag) {
            log += ' ' + this.shardTag;
        }
        log += ' ' + message;
        console.error(log);
        if (error) {
            if (error instanceof Error) {
                console.error(error.stack);
            } else {
                console.error(error);
            }
        }
    }

    public static setShardId(shardId: number): void {
        if (shardId > -1) {
            this.shardTag = `[Shard ${shardId.toString()}]`;
        }
    }
}
