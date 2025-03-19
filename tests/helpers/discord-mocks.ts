import { vi } from 'vitest';
import {
    ChannelType,
    GuildChannel,
    GuildMember,
    PermissionFlagsBits,
    PermissionsBitField,
    PermissionsString,
    ThreadChannel,
    User,
} from 'discord.js';

/**
 * Creates a mock Discord.js User that correctly passes instanceof checks
 */
export function createMockUser(overrides = {}) {
    // Create base object with properties we need
    const baseUser = {
        id: '123456789012345678',
        username: 'TestUser',
        discriminator: '0000',
        tag: 'TestUser#0000',
        displayAvatarURL: vi.fn().mockReturnValue('https://example.com/avatar.png'),
        bot: false,
        system: false,
        flags: { bitfield: 0 },
        createdAt: new Date(),
        createdTimestamp: Date.now(),
        // Common methods
        send: vi.fn().mockResolvedValue({}),
        fetch: vi.fn().mockImplementation(function () {
            return Promise.resolve(this);
        }),
        toString: vi.fn().mockReturnValue('<@123456789012345678>'),
    };

    // Add overrides
    Object.assign(baseUser, overrides);

    // Create a properly structured mock that will pass instanceof checks
    const mockUser = Object.create(User.prototype, {
        ...Object.getOwnPropertyDescriptors(baseUser),
        // Make sure the user correctly identifies as a User
        constructor: { value: User },
    });

    return mockUser;
}

/**
 * Creates a mock Discord.js CommandInteraction
 */
export function createMockCommandInteraction(overrides = {}) {
    // Create a mock guild member first to ensure consistent user data
    const mockMember = createMockGuildMember();

    return {
        id: '987612345678901234',
        user: mockMember.user,
        member: mockMember,
        client: {
            user: {
                id: '987654321098765432',
                username: 'TestBot',
            },
        },
        guild: mockMember.guild,
        channel: createMockGuildChannel(),
        commandName: 'test',
        options: {
            getString: vi.fn(),
            getUser: vi.fn(),
            getInteger: vi.fn(),
            getBoolean: vi.fn(),
            getSubcommand: vi.fn(),
            getSubcommandGroup: vi.fn(),
        },
        reply: vi.fn().mockResolvedValue({}),
        editReply: vi.fn().mockResolvedValue({}),
        deferReply: vi.fn().mockResolvedValue({}),
        followUp: vi.fn().mockResolvedValue({}),
        deferred: false,
        replied: false,
        ...overrides,
    };
}

/**
 * Creates a mock Discord.js GuildChannel that correctly passes instanceof checks
 */
export function createMockGuildChannel(overrides = {}) {
    // Create base object with properties we need
    const baseChannel = {
        id: '444555666777888999',
        name: 'test-channel',
        guild: { id: '111222333444555666', name: 'Test Guild' },
        client: {
            user: { id: '987654321098765432' },
        },
        type: ChannelType.GuildText,
    };

    // Add overrides
    Object.assign(baseChannel, overrides);

    // Create a properly structured mock that will pass instanceof checks
    const mockChannel = Object.create(GuildChannel.prototype, {
        ...Object.getOwnPropertyDescriptors(baseChannel),
        // Make sure the channel correctly identifies as a GuildChannel
        constructor: { value: GuildChannel },
    });

    return mockChannel;
}

/**
 * Creates a mock Discord.js ThreadChannel that correctly passes instanceof checks
 */
export function createMockThreadChannel(overrides = {}) {
    // Create base object with properties we need
    const baseChannel = {
        id: '444555666777888999',
        name: 'test-thread',
        guild: { id: '111222333444555666', name: 'Test Guild' },
        client: {
            user: { id: '987654321098765432' },
        },
        type: ChannelType.PublicThread,
        permissionsFor: vi.fn().mockReturnValue({
            has: vi.fn().mockReturnValue(true),
        }),
    };

    // Add overrides
    Object.assign(baseChannel, overrides);

    // Create a properly structured mock that will pass instanceof checks
    const mockChannel = Object.create(ThreadChannel.prototype, {
        ...Object.getOwnPropertyDescriptors(baseChannel),
        // Make sure the channel correctly identifies as a ThreadChannel
        constructor: { value: ThreadChannel },
    });

    return mockChannel;
}

/**
 * Creates a mock Command object
 */
export function createMockCommand(overrides = {}) {
    return {
        names: ['test'],
        deferType: 'HIDDEN',
        requireClientPerms: [],
        execute: vi.fn().mockResolvedValue({}),
        cooldown: {
            take: vi.fn().mockReturnValue(false),
            amount: 1,
            interval: 5000,
        },
        ...overrides,
    };
}

/**
 * Creates a mock Discord.js GuildMember that correctly passes instanceof checks
 */
export function createMockGuildMember(overrides = {}) {
    // Create a mock user first
    const mockUser = createMockUser();

    // Create base object with properties we need
    const baseMember = {
        id: mockUser.id,
        user: mockUser,
        guild: { id: '111222333444555666', name: 'Test Guild' },
        displayName: mockUser.username,
        nickname: null,
        roles: {
            cache: new Map(),
            highest: { position: 1, id: '222333444555666777' },
            add: vi.fn().mockResolvedValue({}),
            remove: vi.fn().mockResolvedValue({}),
        },
        permissions: new PermissionsBitField(PermissionFlagsBits.SendMessages),
        permissionsIn: vi
            .fn()
            .mockReturnValue(new PermissionsBitField(PermissionFlagsBits.SendMessages)),
        joinedAt: new Date(),
        voice: {
            channelId: null,
            channel: null,
            mute: false,
            deaf: false,
        },
        presence: {
            status: 'online',
            activities: [],
        },
        manageable: true,
        kickable: true,
        bannable: true,
        moderatable: true,
        communicationDisabledUntil: null,
        // Common methods
        kick: vi.fn().mockResolvedValue({}),
        ban: vi.fn().mockResolvedValue({}),
        timeout: vi.fn().mockResolvedValue({}),
        edit: vi.fn().mockResolvedValue({}),
        fetch: vi.fn().mockImplementation(function () {
            return Promise.resolve(this);
        }),
        send: vi.fn().mockResolvedValue({}),
    };

    // Add overrides
    Object.assign(baseMember, overrides);

    // Create a properly structured mock that will pass instanceof checks
    const mockMember = Object.create(GuildMember.prototype, {
        ...Object.getOwnPropertyDescriptors(baseMember),
        // Make sure the member correctly identifies as a GuildMember
        constructor: { value: GuildMember },
    });

    return mockMember;
}
