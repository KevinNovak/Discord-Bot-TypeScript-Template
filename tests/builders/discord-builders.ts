import {
    ApplicationCommand,
    ChannelType,
    Client,
    ClientUser,
    Collection,
    CommandInteraction,
    DMChannel,
    Guild,
    GuildChannel,
    GuildMember,
    GuildMemberRoleManager,
    Message,
    MessageContextMenuCommandInteraction,
    Role,
    RoleResolvable,
    TextChannel,
    ThreadChannel,
    User,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { vi } from 'vitest';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';

import { Command } from '../../src/commands/index.ts';
import { mockProp } from '../helpers/index.ts';

// -----------------------------------------------------------------------------
// User Builder
// -----------------------------------------------------------------------------
export interface UserBuilder {
    withId(id: string): UserBuilder;
    withUsername(name: string): UserBuilder;
    isBot(flag?: boolean): UserBuilder;
    withCreatedTimestamp(timestamp: number | null): UserBuilder;
    withOverrides(overrides: Partial<User>): UserBuilder;
    build(): DeepMockProxy<User>;
}

export function userBuilder(): UserBuilder {
    const user = mockDeep<User>();
    mockProp(user, 'id', 'user123');
    mockProp(user, 'username', 'username-user123');
    mockProp(user, 'globalName', 'globalName-user123');
    mockProp(user, 'displayName', user.globalName ?? user.username);
    mockProp(user, 'discriminator', '0');
    mockProp(user, 'bot', false);
    user.send.mockResolvedValue({} as Message<false>);

    // Set up toString method to return Discord mention format
    Object.defineProperty(user, 'toString', {
        value: vi.fn(() => `<@${user.id}>`),
        writable: true,
        configurable: true,
    });
    const api: UserBuilder = {
        withId: id => {
            mockProp(user, 'id', id);
            mockProp(user, 'username', `username-${id}`);
            mockProp(user, 'globalName', `globalName-${id}`);
            mockProp(user, 'displayName', user.globalName ?? user.username);
            // Update toString to use new ID
            Object.defineProperty(user, 'toString', {
                value: vi.fn(() => `<@${id}>`),
                writable: true,
                configurable: true,
            });
            return api;
        },
        withUsername: name => {
            mockProp(user, 'username', name);
            return api;
        },
        isBot: flag => {
            mockProp(user, 'bot', flag ?? true);
            return api;
        },
        withCreatedTimestamp: (t: number | null) => {
            if (t !== null) {
                mockProp(user, 'createdTimestamp', t);
                Object.defineProperty(user, 'createdAt', {
                    value: new Date(t),
                    writable: true,
                    configurable: true,
                });
            } else {
                Object.defineProperty(user, 'createdTimestamp', {
                    value: null,
                    writable: true,
                    configurable: true,
                });
                Object.defineProperty(user, 'createdAt', {
                    value: null,
                    writable: true,
                    configurable: true,
                });
            }
            return api;
        },
        withOverrides: o => {
            Object.assign(user, o);
            return api;
        },
        build: () => user,
    };
    return api;
}

// -----------------------------------------------------------------------------
// Guild Builder
// -----------------------------------------------------------------------------
export interface GuildBuilder {
    withId(id: string): GuildBuilder;
    withName(name: string): GuildBuilder;
    withOverrides(overrides: Partial<Guild>): GuildBuilder;
    withCreatedTimestamp(timestamp: number | null): GuildBuilder;
    build(): DeepMockProxy<Guild>;
}

export function guildBuilderFactory(): GuildBuilder {
    const guild = mockDeep<Guild>();
    mockProp(guild, 'id', 'guild123');
    mockProp(guild, 'name', 'Test Guild');

    // Mock the channels manager with a working fetch method
    const channelsCollection = new Collection();
    // Use type assertion to work around complex Discord.js typing
    (guild.channels.fetch as any) = vi.fn().mockResolvedValue(channelsCollection);

    // Mock the roles manager with a working fetch method
    const rolesCollection = new Collection();
    (guild.roles.fetch as any) = vi.fn().mockResolvedValue(rolesCollection);

    const api: GuildBuilder = {
        withId: id => {
            mockProp(guild, 'id', id);
            return api;
        },
        withName: n => {
            mockProp(guild, 'name', n);
            return api;
        },
        withCreatedTimestamp: (t: number | null) => {
            if (t !== null) {
                mockProp(guild, 'createdTimestamp', t);
            } else {
                Object.defineProperty(guild, 'createdTimestamp', {
                    value: null,
                    writable: true,
                    configurable: true,
                });
            }
            return api;
        },
        withOverrides: o => {
            Object.assign(guild, o);
            return api;
        },
        build: () => guild,
    };
    return api;
}

export function guildBuilder(): DeepMockProxy<Guild> {
    let guild = guildBuilderFactory().build();

    // Ensure guild.roles.resolve exists as a function so it can be spied upon.
    // Assigning vi.fn() makes it a Vitest mock function from the start.
    // Use 'as any' to bypass strict overload type checking for this assignment.
    guild.roles.resolve = vi.fn() as any;

    // Now spy on it and provide the actual mock implementation.
    vi.spyOn(guild.roles, 'resolve').mockImplementation((roleResolvable: RoleResolvable) => {
        if (typeof roleResolvable === 'string') {
            const mockRole = mockDeep<Role>();
            mockProp(mockRole, 'id', roleResolvable);
            mockProp(mockRole, 'name', `role-${roleResolvable}`);
            mockProp(mockRole, 'guild', guild); // No need for 'as any' if guild is typed correctly
            return mockRole;
        }
        if (roleResolvable instanceof Role) {
            return roleResolvable;
        }
        return null;
    });

    // The channels.fetch() and roles.fetch() are already mocked from guildBuilderFactory,
    // but let's ensure they work properly for any roles/channels that might be needed
    const channelsCollection = new Collection();
    (guild.channels.fetch as any) = vi.fn().mockResolvedValue(channelsCollection);

    const rolesCollection = new Collection();
    (guild.roles.fetch as any) = vi.fn().mockResolvedValue(rolesCollection);

    return guild;
}

// -----------------------------------------------------------------------------
// GuildMember Builder
// -----------------------------------------------------------------------------
export interface GuildMemberBuilder {
    withId(id: string): GuildMemberBuilder;
    withUser(user: DeepMockProxy<User>): GuildMemberBuilder;
    withGuild(guild: DeepMockProxy<Guild>): GuildMemberBuilder;
    withNickname(nick: string | null): GuildMemberBuilder;
    withDisplayName(name: string): GuildMemberBuilder;
    withJoinedTimestamp(timestamp: number | null): GuildMemberBuilder;
    withOverrides(overrides: Partial<GuildMember>): GuildMemberBuilder;
    withHasRole(roleId?: string, hasRole?: boolean): GuildMemberBuilder;
    build(): DeepMockProxy<GuildMember>;
}

export function guildMemberBuilder(userId: string = 'user123'): GuildMemberBuilder {
    const member = mockDeep<GuildMember>();
    mockProp(member, 'id', userId);
    mockProp(member, 'user', userBuilder().withId(userId).build());
    mockProp(member, 'guild', guildBuilderFactory().build());
    mockProp(member, 'nickname', null);
    mockProp(member, 'displayName', member.nickname ?? member.user.username); // Defaults to user's username
    member.send.mockResolvedValue({} as Message<false>);

    // Properly mock the toString method
    // TODO: make this a helper function
    Object.defineProperty(member, 'toString', {
        value: vi.fn(() => `<@${member.id}>`),
        writable: true,
        configurable: true,
    });

    const rolesMock = mockDeep<GuildMemberRoleManager>();
    // Explicitly initialize .cache to ensure it's a functional Collection
    (rolesMock as any).cache = new Collection<string, Role>();
    mockProp(rolesMock, 'highest', { position: 1, id: 'role1' } as any);
    rolesMock.add.mockImplementation(async () => member as unknown as GuildMember);
    rolesMock.remove.mockImplementation(async () => member as unknown as GuildMember);
    mockProp(member, 'roles', rolesMock);

    const api: GuildMemberBuilder = {
        withId: (id: string) => {
            mockProp(member, 'id', id);
            mockProp(member.user, 'id', id);
            // If user.username changes due to id change, displayName might need update.
            // However, userBuilder().withId() only changes id, not username.
            // If displayName was based on username & no nickname, it remains consistent.
            mockProp(member.user, 'username', `username-${id}`);
            mockProp(member.user, 'globalName', `globalName-${id}`);
            mockProp(member.user, 'displayName', member.user.globalName ?? member.user.username);
            return api;
        },
        withUser: (u: DeepMockProxy<User>) => {
            mockProp(member, 'user', u);
            mockProp(member, 'id', u.id);
            if (!member.nickname) {
                mockProp(member, 'displayName', u.username);
            }
            return api;
        },
        withGuild: (g: DeepMockProxy<Guild>) => {
            mockProp(member, 'guild', g);
            return api;
        },
        withNickname: (nick: string | null) => {
            mockProp(member, 'nickname', nick);
            mockProp(member, 'displayName', nick ?? member.user.username);
            return api;
        },
        withDisplayName: (name: string) => {
            mockProp(member, 'displayName', name);
            return api;
        },
        withJoinedTimestamp: (timestamp: number | null) => {
            mockProp(member, 'joinedTimestamp', timestamp);
            if (timestamp !== null) {
                Object.defineProperty(member, 'joinedAt', {
                    value: new Date(timestamp),
                    writable: true,
                    configurable: true,
                });
            } else {
                Object.defineProperty(member, 'joinedAt', {
                    value: null,
                    writable: true,
                    configurable: true,
                });
            }
            return api;
        },
        withHasRole: (roleId?: string, hasRole: boolean = true) => {
            if (!roleId) {
                return api;
            }
            if (hasRole) {
                const mockRole = mockDeep<Role>();
                mockProp(mockRole, 'id', roleId);
                mockProp(mockRole, 'name', `role-${roleId}`);
                mockProp(mockRole, 'guild', member.guild as DeepMockProxy<Guild>);
                rolesMock.cache.set(roleId, mockRole);
            } else {
                rolesMock.cache.delete(roleId);
            }
            return api;
        },
        withOverrides: (o: Partial<GuildMember>) => {
            Object.assign(member, o);
            return api;
        },
        build: (): DeepMockProxy<GuildMember> => member,
    };
    return api;
}

// -----------------------------------------------------------------------------
// TextChannel Builder
// -----------------------------------------------------------------------------
export interface TextChannelBuilder {
    withId(id: string): TextChannelBuilder;
    withName(name: string): TextChannelBuilder;
    withGuild(guild: DeepMockProxy<Guild>): TextChannelBuilder;
    botHasPerms(): TextChannelBuilder;
    botMissingPerms(): TextChannelBuilder;
    withPermissionsFor(fn: any): TextChannelBuilder;
    withOverrides(overrides: Partial<TextChannel>): TextChannelBuilder;
    asGuildChannel(): TextChannelBuilder;
    asThreadChannel(): TextChannelBuilder;
    build(): DeepMockProxy<TextChannel>;
}

export function textChannelBuilder(): TextChannelBuilder {
    const channel = mockDeep<TextChannel>();
    mockProp(channel, 'id', 'channel123');
    mockProp(channel, 'name', 'test-channel');
    mockProp(channel, 'type', ChannelType.GuildText);
    channel.guild = guildBuilderFactory().build();
    channel.send.mockResolvedValue({} as Message<true>);
    channel.messages.fetchPins.mockResolvedValue({
        size: 3,
        filter: vi.fn().mockReturnValue([]),
    } as any);
    setPermissions(channel, true); // default → bot **has** perms
    const api: TextChannelBuilder = {
        withId: (id: string) => {
            mockProp(channel, 'id', id);
            return api;
        },
        withName: (name: string) => {
            mockProp(channel, 'name', name);
            return api;
        },
        withGuild: (guild: DeepMockProxy<Guild>) => {
            channel.guild = guild;
            return api;
        },
        botHasPerms: () => {
            setPermissions(channel, true);
            return api;
        },
        botMissingPerms: () => {
            setPermissions(channel, false);
            return api;
        },
        withPermissionsFor: (fn: any) => {
            channel.permissionsFor = fn;
            return api;
        },
        withOverrides: (overrides: Partial<TextChannel>) => {
            Object.assign(channel, overrides);
            return api;
        },
        asGuildChannel: () => {
            Object.setPrototypeOf(channel, GuildChannel.prototype);
            return api;
        },
        asThreadChannel: () => {
            Object.setPrototypeOf(channel, ThreadChannel.prototype);
            return api;
        },
        build: () => channel,
    };
    return api;
}

// -----------------------------------------------------------------------------
// DMChannel Builder
// -----------------------------------------------------------------------------
export interface DMChannelBuilder {
    withId(id: string): DMChannelBuilder;
    withRecipient(user: DeepMockProxy<User>): DMChannelBuilder;
    withOverrides(overrides: Partial<DMChannel>): DMChannelBuilder;
    build(): DeepMockProxy<DMChannel>;
}

export function dmChannelBuilder(): DMChannelBuilder {
    const channel = mockDeep<DMChannel>();
    mockProp(channel, 'id', 'dmchannel123');
    mockProp(channel, 'type', ChannelType.DM);

    // Set up a default recipient
    const defaultRecipient = userBuilder().withId('dmrecipient123').build();
    mockProp(channel, 'recipient', defaultRecipient);

    // Set up channel methods
    channel.send.mockResolvedValue({} as Message<false>);

    // Ensure instanceof check works for DMChannel
    Object.setPrototypeOf(channel, DMChannel.prototype);

    const api: DMChannelBuilder = {
        withId: (id: string) => {
            mockProp(channel, 'id', id);
            return api;
        },
        withRecipient: (user: DeepMockProxy<User>) => {
            mockProp(channel, 'recipient', user);
            return api;
        },
        withOverrides: (overrides: Partial<DMChannel>) => {
            Object.assign(channel, overrides);
            return api;
        },
        build: () => channel,
    };
    return api;
}

// -----------------------------------------------------------------------------
// Role Builder
// -----------------------------------------------------------------------------
export interface RoleBuilder {
    withId(id: string): RoleBuilder;
    withName(name: string): RoleBuilder;
    withGuild(guild: DeepMockProxy<Guild>): RoleBuilder;
    build(): DeepMockProxy<Role>;
}

export function roleBuilder(): RoleBuilder {
    const role = mockDeep<Role>();
    mockProp(role, 'id', 'role123');
    mockProp(role, 'name', 'test-role');
    const api: RoleBuilder = {
        withId: (id: string) => {
            mockProp(role, 'id', id);
            return api;
        },
        withName: (name: string) => {
            mockProp(role, 'name', name);
            return api;
        },
        withGuild: (guild: DeepMockProxy<Guild>) => {
            mockProp(role, 'guild', guild);
            return api;
        },
        build: () => role,
    };
    return api;
}

// -----------------------------------------------------------------------------
// Message Builder
// -----------------------------------------------------------------------------
export interface MessageBuilder {
    withId(id: string): MessageBuilder;
    withContent(content: string): MessageBuilder;
    withAuthor(author: DeepMockProxy<User>): MessageBuilder;
    withChannel(channel: DeepMockProxy<TextChannel>): MessageBuilder;
    withOverrides(overrides: Partial<Message>): MessageBuilder;
    withGuild(guild: DeepMockProxy<Guild>): MessageBuilder;
    withCreatedTimestamp(timestamp: number | null): MessageBuilder;
    build(): DeepMockProxy<Message>;
}

export function messageBuilder(): MessageBuilder {
    const message = mockDeep<Message>();
    mockProp(message, 'id', 'message123');
    mockProp(message, 'content', 'test-message');
    mockProp(message, 'author', userBuilder().build());
    mockProp(message, 'channel', textChannelBuilder().build());
    mockProp(message, 'guild', guildBuilderFactory().build());

    message.startThread.mockResolvedValue({
        id: 'mock-thread-id',
    } as any);

    const api: MessageBuilder = {
        withId: (id: string) => {
            mockProp(message, 'id', id);

            return api;
        },
        withContent: (content: string) => {
            mockProp(message, 'content', content);
            return api;
        },
        withAuthor: (author: DeepMockProxy<User>) => {
            mockProp(message, 'author', author);
            return api;
        },
        withChannel: (channel: DeepMockProxy<TextChannel>) => {
            mockProp(message, 'channel', channel);
            return api;
        },
        withOverrides: (overrides: Partial<Message>) => {
            Object.assign(message, overrides);
            return api;
        },
        withGuild: (guild: DeepMockProxy<Guild>) => {
            mockProp(message, 'guild', guild);
            return api;
        },
        withCreatedTimestamp: (timestamp: number | null) => {
            if (timestamp !== null) {
                mockProp(message, 'createdTimestamp', timestamp);
                Object.defineProperty(message, 'createdAt', {
                    value: new Date(timestamp),
                    writable: true,
                    configurable: true,
                });
            } else {
                Object.defineProperty(message, 'createdTimestamp', {
                    value: null,
                    writable: true,
                    configurable: true,
                });
                Object.defineProperty(message, 'createdAt', {
                    value: null,
                    writable: true,
                    configurable: true,
                });
            }
            return api;
        },
        build: () => message,
    };
    return api;
}
// -----------------------------------------------------------------------------
// Client Builder
// -----------------------------------------------------------------------------
export interface ClientBuilder {
    withUser(user: DeepMockProxy<ClientUser>): ClientBuilder;
    withOverrides(overrides: Partial<Client>): ClientBuilder;
    withGuilds(guilds: DeepMockProxy<Guild>[]): ClientBuilder;
    build(): DeepMockProxy<Client>;
}

export function clientBuilder(): ClientBuilder {
    const client = mockDeep<Client<true>>();
    client.guilds.cache.set('guild123', guildBuilderFactory().build());
    client.guilds.fetch.mockImplementation(options => {
        if (typeof options === 'string' && options === 'guild123') {
            return Promise.resolve(guildBuilderFactory().build());
        }
        const collection = new Map();
        collection.set('guild123', guildBuilderFactory().build());
        return Promise.resolve(collection as any);
    });
    client.user = clientUserBuilder().build();
    const api: ClientBuilder = {
        withUser: (user: DeepMockProxy<ClientUser>) => {
            mockProp(client, 'user', user);
            return api;
        },
        withOverrides: (overrides: Partial<Client>) => {
            Object.assign(client, overrides);
            return api;
        },
        withGuilds: (guilds: DeepMockProxy<Guild>[]) => {
            guilds.forEach(g => client.guilds.cache.set(g.id, g));
            return api;
        },
        build: () => client,
    };
    return api;
}

// -----------------------------------------------------------------------------
// ClientUser Builder (simple)
// -----------------------------------------------------------------------------
export interface ClientUserBuilder {
    withId(id: string): ClientUserBuilder;
    withOverrides(overrides: Partial<ClientUser>): ClientUserBuilder;
    build(): DeepMockProxy<ClientUser>;
}

export function clientUserBuilder(): ClientUserBuilder {
    const user = mockDeep<ClientUser>();
    mockProp(user, 'id', '987654321098765432');
    const api: ClientUserBuilder = {
        withId: (id: string) => {
            mockProp(user, 'id', id);
            return api;
        },
        withOverrides: (overrides: Partial<ClientUser>) => {
            Object.assign(user, overrides);
            return api;
        },
        build: () => user,
    };
    return api;
}

// -----------------------------------------------------------------------------
// CommandInteraction Builder
// -----------------------------------------------------------------------------
export interface InteractionBuilder {
    withUser(user: DeepMockProxy<User>): InteractionBuilder;
    withChannel(channel: DeepMockProxy<TextChannel>): InteractionBuilder;
    withClientUser(bot: DeepMockProxy<ClientUser>): InteractionBuilder;
    withOverrides(overrides: Partial<CommandInteraction>): InteractionBuilder;
    build(): DeepMockProxy<CommandInteraction>;
}

export function interactionBuilder(): InteractionBuilder {
    const interaction = mockDeep<CommandInteraction>();
    const user = userBuilder().build();
    mockProp(interaction, 'user', user);
    const client = mockDeep<Client<true>>();
    const clientUser = mockDeep<ClientUser>();
    mockProp(clientUser, 'id', '987654321098765432');
    mockProp(client, 'user', clientUser);
    mockProp(interaction, 'client', client);
    const channel = textChannelBuilder().build();
    mockProp(interaction, 'channel', channel);
    const api: InteractionBuilder = {
        withUser: u => {
            mockProp(interaction, 'user', u);
            return api;
        },
        withChannel: ch => {
            mockProp(interaction, 'channel', ch);
            return api;
        },
        withClientUser: cu => {
            const cl = interaction.client as DeepMockProxy<Client<true>>;
            mockProp(cl, 'user', cu);
            return api;
        },
        withOverrides: o => {
            Object.assign(interaction, o);
            return api;
        },
        build: () => interaction,
    };
    return api;
}

// -----------------------------------------------------------------------------
// ApplicationCommand, Command, RateLimiter, Client Factories
// -----------------------------------------------------------------------------
export function createMockApplicationCommand(
    overrides: Partial<ApplicationCommand> = {}
): DeepMockProxy<ApplicationCommand> {
    const command = mockDeep<ApplicationCommand>();
    mockProp(command, 'id', '123456789012345678');
    mockProp(command, 'name', 'mock-command');
    Object.assign(command, overrides);
    return command;
}

export function createMockCommand(overrides: Partial<Command> = {}): DeepMockProxy<Command> {
    const command = mockDeep<Command>();
    command.requireClientPerms = ['ViewChannel', 'SendMessages'];
    command.cooldown = createMockRateLimiter(overrides?.cooldown);
    Object.assign(command, overrides);
    return command;
}

export function createMockRateLimiter(
    overrides: Partial<RateLimiter> = {}
): DeepMockProxy<RateLimiter> {
    const rateLimiter = mockDeep<RateLimiter>();
    rateLimiter.amount = 1;
    rateLimiter.interval = 5000;
    rateLimiter.take.mockReturnValue(false);
    Object.assign(rateLimiter, overrides);
    return rateLimiter;
}

// export function createMockDate(timestamp: number): DeepMockProxy<Date> {
//     const date = mockDeep<Date>();
//     const realDate = new Date(timestamp);

//     // Mock the most commonly used Date methods
//     date.getTime.mockReturnValue(timestamp);
//     return date;
// }

// -----------------------------------------------------------------------------
// MessageContextMenuCommandInteraction Builder
// -----------------------------------------------------------------------------
export interface MessageContextMenuInteractionBuilder {
    withUser(user: DeepMockProxy<User>): MessageContextMenuInteractionBuilder;
    withChannel(channel: DeepMockProxy<TextChannel>): MessageContextMenuInteractionBuilder;
    withClientUser(bot: DeepMockProxy<ClientUser>): MessageContextMenuInteractionBuilder;
    withTargetMessage(message: DeepMockProxy<Message>): MessageContextMenuInteractionBuilder;
    withGuild(guild: DeepMockProxy<Guild>): MessageContextMenuInteractionBuilder;
    withOverrides(
        overrides: Partial<MessageContextMenuCommandInteraction>
    ): MessageContextMenuInteractionBuilder;
    build(): DeepMockProxy<MessageContextMenuCommandInteraction>;
}

export function messageContextMenuInteractionBuilder(): MessageContextMenuInteractionBuilder {
    const interaction = mockDeep<MessageContextMenuCommandInteraction>();
    const user = userBuilder().build();
    mockProp(interaction, 'user', user);
    const client = mockDeep<Client<true>>();
    const clientUser = mockDeep<ClientUser>();
    mockProp(clientUser, 'id', '987654321098765432');
    mockProp(client, 'user', clientUser);
    mockProp(interaction, 'client', client);
    const channel = textChannelBuilder().build();
    mockProp(interaction, 'channel', channel);
    const targetMessage = messageBuilder().build();
    mockProp(interaction, 'targetMessage', targetMessage);

    // Set up interaction methods
    interaction.editReply.mockResolvedValue({} as any);
    interaction.followUp.mockResolvedValue({} as any);

    const api: MessageContextMenuInteractionBuilder = {
        withUser: u => {
            mockProp(interaction, 'user', u);
            return api;
        },
        withChannel: ch => {
            mockProp(interaction, 'channel', ch);
            return api;
        },
        withClientUser: cu => {
            const cl = interaction.client as DeepMockProxy<Client<true>>;
            mockProp(cl, 'user', cu);
            return api;
        },
        withTargetMessage: msg => {
            mockProp(interaction, 'targetMessage', msg);
            return api;
        },
        withGuild: g => {
            mockProp(interaction, 'guild', g);
            return api;
        },
        withOverrides: o => {
            Object.assign(interaction, o);
            return api;
        },
        build: () => interaction,
    };
    return api;
}

// -----------------------------------------------------------------------------
// UserContextMenuCommandInteraction Builder
// -----------------------------------------------------------------------------
export interface UserContextMenuInteractionBuilder {
    withUser(user: DeepMockProxy<User>): UserContextMenuInteractionBuilder;
    withChannel(channel: DeepMockProxy<TextChannel>): UserContextMenuInteractionBuilder;
    withClientUser(bot: DeepMockProxy<ClientUser>): UserContextMenuInteractionBuilder;
    withTargetUser(user: DeepMockProxy<User>): UserContextMenuInteractionBuilder;
    withGuild(guild: DeepMockProxy<Guild>): UserContextMenuInteractionBuilder;
    withMember(member: DeepMockProxy<GuildMember>): UserContextMenuInteractionBuilder;
    withOverrides(
        overrides: Partial<UserContextMenuCommandInteraction>
    ): UserContextMenuInteractionBuilder;
    build(): DeepMockProxy<UserContextMenuCommandInteraction>;
}

export function userContextMenuInteractionBuilder(): UserContextMenuInteractionBuilder {
    const interaction = mockDeep<UserContextMenuCommandInteraction>();
    const user = userBuilder().build();
    mockProp(interaction, 'user', user);
    const client = mockDeep<Client<true>>();
    const clientUser = mockDeep<ClientUser>();
    mockProp(clientUser, 'id', '987654321098765432');
    mockProp(client, 'user', clientUser);
    mockProp(interaction, 'client', client);
    const channel = textChannelBuilder().build();
    mockProp(interaction, 'channel', channel);
    const targetUser = userBuilder().withId('target123').build();
    mockProp(interaction, 'targetUser', targetUser);

    // Set up interaction methods
    interaction.editReply.mockResolvedValue({} as any);
    interaction.followUp.mockResolvedValue({} as any);

    const api: UserContextMenuInteractionBuilder = {
        withUser: u => {
            mockProp(interaction, 'user', u);
            return api;
        },
        withChannel: ch => {
            mockProp(interaction, 'channel', ch);
            return api;
        },
        withClientUser: cu => {
            const cl = interaction.client as DeepMockProxy<Client<true>>;
            mockProp(cl, 'user', cu);
            return api;
        },
        withTargetUser: tu => {
            mockProp(interaction, 'targetUser', tu);
            return api;
        },
        withGuild: g => {
            mockProp(interaction, 'guild', g);
            return api;
        },
        withMember: m => {
            mockProp(interaction, 'member', m);
            return api;
        },
        withOverrides: o => {
            Object.assign(interaction, o);
            return api;
        },
        build: () => interaction,
    };
    return api;
}

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------
function setPermissions(c: DeepMockProxy<TextChannel>, ok: boolean): void {
    c.permissionsFor.mockReturnValue({ has: vi.fn().mockReturnValue(ok) } as any);
}

export function asPrototype<T extends object, P extends object>(obj: T, prototype: P): T {
    Object.setPrototypeOf(obj, prototype);
    return obj;
}
