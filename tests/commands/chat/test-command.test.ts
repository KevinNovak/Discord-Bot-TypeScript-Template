import { Locale } from 'discord.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestCommand } from '../../../src/commands/chat/test-command.js';
import { EventData } from '../../../src/models/internal-models.js';
import { InteractionUtils } from '../../../src/utils/index.js';
import { interactionBuilder } from '../../builders/discord-builders.js';

// Mock dependencies
vi.mock('../../../src/utils/index.js', () => ({
    InteractionUtils: {
        send: vi.fn().mockResolvedValue({}),
    },
}));

describe('TestCommand', () => {
    let testCommand: TestCommand;
    let mockEventData: EventData;

    beforeEach(() => {
        testCommand = new TestCommand();
        mockEventData = new EventData(Locale.EnglishUS, Locale.EnglishUS);
    });

    it('should have correct command properties', () => {
        expect(testCommand.names).toEqual(['test']);
        expect(testCommand.deferType).toBe('HIDDEN');
        expect(testCommand.requireClientPerms).toEqual([]);
        expect(testCommand.cooldown).toBeDefined();
        expect(testCommand.cooldown.amount).toBe(1);
        expect(testCommand.cooldown.interval).toBe(5000);
    });

    describe('execute', () => {
        it('should send test embed when command is executed', async () => {
            const interaction = interactionBuilder().build();

            // Act
            await testCommand.execute(interaction as any, mockEventData);

            expect(InteractionUtils.send).toHaveBeenCalledWith(
                interaction,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: 'Test command works!',
                        color: 39423,
                    }),
                })
            );
        });
    });
});
