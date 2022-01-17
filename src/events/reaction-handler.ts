import { Message, MessageReaction, User } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { EventData } from '../models/internal-models.js';
import { Reaction } from '../reactions/index.js';
import { EventHandler } from './index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class ReactionHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.reactions.amount,
        Config.rateLimiting.reactions.interval * 1000
    );

    constructor(private reactions: Reaction[]) {}

    public async process(msgReaction: MessageReaction, msg: Message, reactor: User): Promise<void> {
        // Don't respond to self, or other bots
        if (reactor.id === msgReaction.client.user?.id || reactor.bot) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
            return;
        }

        // Try to find the reaction the user wants
        let reaction = this.findReaction(msgReaction.emoji.name);
        if (!reaction) {
            return;
        }

        if (reaction.requireGuild && !msg.guild) {
            return;
        }

        if (reaction.requireSentByClient && msg.author.id !== msg.client.user?.id) {
            return;
        }

        // Check if the embeds author equals the reactors tag
        if (reaction.requireEmbedAuthorTag && msg.embeds[0]?.author?.name !== reactor.tag) {
            return;
        }

        // TODO: Get data from database
        let data = new EventData();

        // Execute the reaction
        await reaction.execute(msgReaction, msg, reactor, data);
    }

    private findReaction(emoji: string): Reaction {
        return this.reactions.find(reaction => reaction.emoji === emoji);
    }
}
