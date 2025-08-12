import { Locale, Message } from 'discord.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ViewDateSent } from '../../../src/commands/message/view-date-sent.js';
import { EventData } from '../../../src/models/internal-models.js';
import { InteractionUtils } from '../../../src/utils/index.js';
import {
    messageBuilder,
    messageContextMenuInteractionBuilder,
} from '../../builders/discord-builders.js';

// Mock dependencies
vi.mock('../../../src/utils/index.js', () => ({
    InteractionUtils: {
        send: vi.fn().mockResolvedValue({}),
    },
}));

describe('ViewDateSent', () => {
    let viewDateSentCommand: ViewDateSent;
    let mockEventData: EventData;

    beforeEach(() => {
        viewDateSentCommand = new ViewDateSent();
        mockEventData = new EventData(Locale.EnglishUS, Locale.EnglishUS);
        vi.clearAllMocks();
    });

    it('should have correct command properties', () => {
        expect(viewDateSentCommand.names).toEqual(['View Date Sent']);
        expect(viewDateSentCommand.deferType).toBe('HIDDEN');
        expect(viewDateSentCommand.requireClientPerms).toEqual([]);
        expect(viewDateSentCommand.cooldown).toBeDefined();
        expect(viewDateSentCommand.cooldown.amount).toBe(1);
        expect(viewDateSentCommand.cooldown.interval).toBe(5000);
    });

    describe('execute', () => {
        it('should send message with formatted date when command is executed', async () => {
            const targetMessage = messageBuilder()
                .withId('targetmessage123')
                .withContent('Target message content')
                .withOverrides({
                    createdAt: new Date('2024-01-15T10:30:00Z'),
                } as Partial<Message<boolean>>)
                .build();

            const interaction = messageContextMenuInteractionBuilder()
                .withTargetMessage(targetMessage)
                .build();

            // Act
            await viewDateSentCommand.execute(interaction as any, mockEventData);

            // Assert
            expect(InteractionUtils.send).toHaveBeenCalledTimes(1);
            expect(InteractionUtils.send).toHaveBeenCalledWith(
                interaction,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: 'This message was sent on Monday, January 15, 2024!',
                        color: 39423,
                    }),
                })
            );
        });

        it('should handle messages with different creation timestamps', async () => {
            const oldMessage = messageBuilder()
                .withId('oldmessage789')
                .withContent('Very old message')
                .withCreatedTimestamp(new Date('2020-03-10T08:15:30Z').getTime())
                .build();

            const interaction = messageContextMenuInteractionBuilder()
                .withTargetMessage(oldMessage)
                .build();

            // Act
            await viewDateSentCommand.execute(interaction as any, mockEventData);

            expect(InteractionUtils.send).toHaveBeenCalledTimes(1);
            expect(InteractionUtils.send).toHaveBeenCalledWith(
                interaction,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: 'This message was sent on Tuesday, March 10, 2020!',
                        color: 39423,
                    }),
                })
            );
        });
    });
});
