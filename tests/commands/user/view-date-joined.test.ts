import { Locale } from 'discord.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ViewDateJoined } from '../../../src/commands/user/view-date-joined.js';
import { EventData } from '../../../src/models/internal-models.js';
import { InteractionUtils } from '../../../src/utils/index.js';
import {
    dmChannelBuilder,
    guildMemberBuilder,
    textChannelBuilder,
    userBuilder,
    userContextMenuInteractionBuilder,
} from '../../builders/discord-builders.js';

// Mock dependencies
vi.mock('../../../src/utils/index.js', () => ({
    InteractionUtils: {
        send: vi.fn().mockResolvedValue({}),
    },
}));

describe('ViewDateJoined', () => {
    let viewDateJoinedCommand: ViewDateJoined;
    let mockEventData: EventData;

    beforeEach(() => {
        viewDateJoinedCommand = new ViewDateJoined();
        mockEventData = new EventData(Locale.EnglishUS, Locale.EnglishUS);
        vi.clearAllMocks();
    });

    it('should have correct command properties', () => {
        expect(viewDateJoinedCommand.names).toEqual(['View Date Joined']);
        expect(viewDateJoinedCommand.deferType).toBe('HIDDEN');
        expect(viewDateJoinedCommand.requireClientPerms).toEqual([]);
        expect(viewDateJoinedCommand.cooldown).toBeDefined();
        expect(viewDateJoinedCommand.cooldown.amount).toBe(1);
        expect(viewDateJoinedCommand.cooldown.interval).toBe(5000);
    });

    describe('execute', () => {
        it('should show guild join date when used in guild channel', async () => {
            const targetUser = userBuilder()
                .withId('targetuser123')
                .withUsername('TargetUser')
                .build();

            const guildMember = guildMemberBuilder()
                .withId('targetuser123')
                .withUser(targetUser)
                .withJoinedTimestamp(new Date('2024-01-15T10:30:00Z').getTime())
                .build();

            const guildChannel = textChannelBuilder()
                .withId('textchannel123')
                .withName('general')
                .build();

            const mockGuild = {
                members: {
                    fetch: vi.fn().mockResolvedValue(guildMember),
                },
            };

            const interaction = userContextMenuInteractionBuilder()
                .withChannel(guildChannel)
                .withTargetUser(targetUser)
                .withGuild(mockGuild as any)
                .build();

            // Act
            await viewDateJoinedCommand.execute(interaction as any, mockEventData);

            // Assert
            expect(mockGuild.members.fetch).toHaveBeenCalledWith('targetuser123');
            expect(InteractionUtils.send).toHaveBeenCalledTimes(1);
            expect(InteractionUtils.send).toHaveBeenCalledWith(
                interaction,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: '<@targetuser123> joined on Monday, January 15, 2024!',
                        color: 39423,
                    }),
                })
            );
        });

        it('should show account creation date when used in DM channel', async () => {
            const targetUser = userBuilder()
                .withId('targetuser456')
                .withUsername('DMUser')
                .withCreatedTimestamp(new Date('2023-05-20T14:25:00Z').getTime())
                .build();

            // Create a proper DM channel mock
            const dmChannel = dmChannelBuilder().build();

            const interaction = userContextMenuInteractionBuilder()
                .withTargetUser(targetUser)
                .withChannel(dmChannel as any)
                .withGuild(null as any)
                .build();

            // Act
            await viewDateJoinedCommand.execute(interaction as any, mockEventData);

            // Assert
            expect(InteractionUtils.send).toHaveBeenCalledTimes(1);
            expect(InteractionUtils.send).toHaveBeenCalledWith(
                interaction,
                expect.objectContaining({
                    data: expect.objectContaining({
                        description: '<@targetuser456> joined on Saturday, May 20, 2023!',
                        color: 39423,
                    }),
                })
            );
        });
    });
});
