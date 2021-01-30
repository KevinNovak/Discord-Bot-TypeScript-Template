import { Client, Constants, Guild, Message, RateLimitData } from 'discord.js';

import { GuildJoinHandler, GuildLeaveHandler, MessageHandler } from './events';
import { Job } from './jobs';
import { Logger } from './services';

let Config = require('../config/config.json');
let Debug = require('../config/debug.json');
let Logs = require('../lang/logs.json');

export class Bot {
    private ready = false;

    constructor(
        private token: string,
        private client: Client,
        private guildJoinHandler: GuildJoinHandler,
        private guildLeaveHandler: GuildLeaveHandler,
        private messageHandler: MessageHandler,
        private jobs: Job[]
    ) {}

    public async start(): Promise<void> {
        this.registerListeners();
        await this.login(this.token);
    }

    private registerListeners(): void {
        this.client.on(Constants.Events.CLIENT_READY, () => this.onReady());
        this.client.on(Constants.Events.SHARD_READY, (shardId: number) =>
            this.onShardReady(shardId)
        );
        this.client.on(Constants.Events.GUILD_CREATE, (guild: Guild) => this.onGuildJoin(guild));
        this.client.on(Constants.Events.GUILD_DELETE, (guild: Guild) => this.onGuildLeave(guild));
        this.client.on(Constants.Events.MESSAGE_CREATE, (msg: Message) => this.onMessage(msg));
        this.client.on(Constants.Events.RATE_LIMIT, (rateLimitData: RateLimitData) =>
            this.onRateLimit(rateLimitData)
        );
    }

    private startJobs(): void {
        for (let job of this.jobs) {
            job.start();
        }
    }

    private async login(token: string): Promise<void> {
        try {
            await this.client.login(token);
        } catch (error) {
            Logger.error(Logs.error.login, error);
            return;
        }
    }

    private onReady(): void {
        let userTag = this.client.user.tag;
        Logger.info(Logs.info.login.replace('{USER_TAG}', userTag));

        if (!Debug.dummyMode.enabled) {
            this.startJobs();
        }

        this.ready = true;
    }

    private onShardReady(shardId: number): void {
        Logger.setShardId(shardId);
    }

    private async onGuildJoin(guild: Guild): Promise<void> {
        if (!this.ready || Debug.dummyMode.enabled) {
            return;
        }

        try {
            await this.guildJoinHandler.process(guild);
        } catch (error) {
            Logger.error(Logs.error.guildJoin, error);
        }
    }

    private async onGuildLeave(guild: Guild): Promise<void> {
        if (!this.ready || Debug.dummyMode.enabled) {
            return;
        }

        try {
            await this.guildLeaveHandler.process(guild);
        } catch (error) {
            Logger.error(Logs.error.guildLeave, error);
        }
    }

    private async onMessage(msg: Message): Promise<void> {
        if (
            !this.ready ||
            (Debug.dummyMode.enabled && !Debug.dummyMode.whitelist.includes(msg.author.id))
        ) {
            return;
        }

        try {
            await this.messageHandler.process(msg);
        } catch (error) {
            Logger.error(Logs.error.message, error);
        }
    }

    private async onRateLimit(rateLimitData: RateLimitData): Promise<void> {
        if (rateLimitData.timeout >= Config.logging.rateLimit.minTimeout * 1000) {
            Logger.error(Logs.error.rateLimit, rateLimitData);
        }
    }
}
