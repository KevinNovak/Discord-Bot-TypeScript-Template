import { MessageReaction, User } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventHandler } from '.';
import { EventData } from '../models/internal-models';
import { Reaction } from '../reactions';

let Config = require('../../config/config.json');

export class ReactionHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.reactions.amount,
        Config.rateLimiting.reactions.interval * 1000
    );

    constructor(private reactions: Reaction[]) {}

    public async process(msgReaction: MessageReaction, reactor: User): Promise<void> {
        let msg = msgReaction.message;

        // Don't respond to self, or other bots
        if (reactor.id === msgReaction.client.user.id || reactor.bot) {
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

        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
            return;
        }

        // TODO: Get data from database
        let data = new EventData();

        // Execute the reaction
        await reaction.execute(msgReaction, reactor, data);
    }

    private findReaction(emoji: string): Reaction {
        return this.reactions.find(reaction => reaction.emoji === emoji);
    }
}
