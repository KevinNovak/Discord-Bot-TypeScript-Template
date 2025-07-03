import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Command } from '../../src/commands/index.js';
import { CommandUtils } from '../../src/utils/command-utils.js';
import {
    createMockCommand,
    createMockCommandInteraction,
    createMockGuildChannel,
} from '../helpers/discord-mocks.js';

// Mock dependencies
vi.mock('../../src/utils/index.js', () => ({
    InteractionUtils: {
        send: vi.fn().mockResolvedValue({}),
    },
    FormatUtils: {
        duration: vi.fn().mockReturnValue('5 seconds'),
    },
}));

vi.mock('../../src/services/index.js', () => ({
    Lang: {
        getEmbed: vi.fn().mockReturnValue({ title: 'Mock Embed' }),
    },
}));

vi.mock('../../src/models/enum-helpers/index.js', () => ({
    Permission: {
        Data: {
            ViewChannel: {
                displayName: vi.fn().mockReturnValue('View Channel'),
            },
            SendMessages: {
                displayName: vi.fn().mockReturnValue('Send Messages'),
            },
        },
    },
}));

describe('CommandUtils', () => {
    // Test findCommand method
    describe('findCommand', () => {
        let mockCommands: Command[];

        beforeEach(() => {
            // Create mock commands using the helper
            mockCommands = [
                createMockCommand({ names: ['test'] }),
                createMockCommand({ names: ['user', 'info'] }),
                createMockCommand({ names: ['user', 'avatar'] }),
            ] as unknown as Command[];
        });

        it('should find a command with exact match', () => {
            const result = CommandUtils.findCommand(mockCommands, ['test']);
            expect(result).toBe(mockCommands[0]);
        });

        it('should find a nested command with exact match', () => {
            const result = CommandUtils.findCommand(mockCommands, ['user', 'info']);
            expect(result).toBe(mockCommands[1]);
        });

        it('should return undefined if no match found', () => {
            const result = CommandUtils.findCommand(mockCommands, ['nonexistent']);
            expect(result).toBeUndefined();
        });
    });

    // Test runChecks method
    describe('runChecks', () => {
        let mockCommand: Command & {
            cooldown: { take: ReturnType<typeof vi.fn>; amount: number; interval: number };
        };
        let mockInteraction: any;
        let mockEventData: any;

        beforeEach(() => {
            // Create a mock command with cooldown using helper
            const cmdMock = createMockCommand({
                requireClientPerms: ['ViewChannel', 'SendMessages'], // Use correct permission names
                cooldown: {
                    take: vi.fn(),
                    amount: 1,
                    interval: 5000,
                },
            });

            // Explicitly type the mock command to include the cooldown property
            mockCommand = cmdMock as unknown as Command & {
                cooldown: {
                    take: ReturnType<typeof vi.fn>;
                    amount: number;
                    interval: number;
                };
            };

            // Create a mock interaction using helper
            mockInteraction = createMockCommandInteraction({
                user: { id: '123456789012345678' },
                client: { user: { id: '987654321098765432' } },
                channel: createMockGuildChannel({
                    permissionsFor: vi.fn().mockReturnValue({
                        has: vi.fn().mockReturnValue(true),
                    }),
                }),
            });

            // Create mock event data
            mockEventData = { lang: 'en-US' };
        });

        it('should pass checks when all requirements are met', async () => {
            // Mock cooldown.take to return false (not limited)
            mockCommand.cooldown.take.mockReturnValue(false);

            const result = await CommandUtils.runChecks(
                mockCommand,
                mockInteraction,
                mockEventData
            );

            expect(result).toBe(true);
            expect(mockCommand.cooldown.take).toHaveBeenCalledWith('123456789012345678');
        });

        it('should fail and send message when on cooldown', async () => {
            // Mock the imported InteractionUtils.send function
            const { InteractionUtils } = await import('../../src/utils/index.js');

            // Mock cooldown.take to return true (is limited)
            mockCommand.cooldown.take.mockReturnValue(true);

            const result = await CommandUtils.runChecks(
                mockCommand,
                mockInteraction,
                mockEventData
            );

            expect(result).toBe(false);
            expect(mockCommand.cooldown.take).toHaveBeenCalledWith('123456789012345678');
            expect(InteractionUtils.send).toHaveBeenCalled();
        });

        it('should fail when missing client permissions', async () => {
            // Mock the imported InteractionUtils.send function
            const { InteractionUtils } = await import('../../src/utils/index.js');

            // Create a GuildChannel mock with failing permission check
            mockInteraction.channel = createMockGuildChannel({
                permissionsFor: vi.fn().mockReturnValue({
                    has: vi.fn().mockReturnValue(false),
                }),
            });

            // Set up command for test
            mockCommand.cooldown.take.mockReturnValue(false);

            // Run test
            const result = await CommandUtils.runChecks(
                mockCommand,
                mockInteraction,
                mockEventData
            );

            // Verify the result
            expect(result).toBe(false);
            expect(InteractionUtils.send).toHaveBeenCalled();
        });
    });
});
