import { ApplicationCommand, Guild, Locale } from 'discord.js';
import { describe, expect, it, vi } from 'vitest';

import { FormatUtils } from '../../src/utils/index.js';

// Mock any configs that might be loaded
vi.mock('../../config/config.json', () => ({}));
vi.mock('../../config/debug.json', () => ({}));
vi.mock('../../lang/logs.json', () => ({}));

// Mock the external dependencies
vi.mock('filesize', () => ({
    filesize: vi.fn().mockImplementation(bytes => {
        if (bytes === 1024) return '1.00 KB';
        if (bytes === 1048576) return '1.00 MB';
        return `${bytes} B`;
    }),
}));

vi.mock('luxon', () => ({
    Duration: {
        fromMillis: vi.fn().mockImplementation(ms => ({
            shiftTo: vi.fn().mockReturnValue({
                toObject: vi.fn().mockReturnValue({
                    hours: ms === 3600000 ? 1 : 0,
                    minutes: ms === 60000 ? 1 : 0,
                    seconds: ms === 5000 ? 5 : 0,
                }),
            }),
        })),
        fromObject: vi.fn().mockImplementation(obj => ({
            toHuman: vi.fn().mockImplementation(() => {
                if (obj.hours === 1) return '1 hour';
                if (obj.minutes === 1) return '1 minute';
                if (obj.seconds === 5) return '5 seconds';
                return 'unknown duration';
            }),
        })),
    },
}));

describe('FormatUtils', () => {
    describe('roleMention', () => {
        it('should return @here for @here mentions', () => {
            const mockGuild = { id: '123456789012345678' } as Guild;
            const result = FormatUtils.roleMention(mockGuild, '@here');
            expect(result).toBe('@here');
        });

        it('should return @everyone for guild id mentions', () => {
            const mockGuild = { id: '123456789012345678' } as Guild;
            const result = FormatUtils.roleMention(mockGuild, '123456789012345678');
            expect(result).toBe('@everyone');
        });

        it('should format regular role mentions', () => {
            const mockGuild = { id: '123456789012345678' } as Guild;
            const result = FormatUtils.roleMention(mockGuild, '987654321098765432');
            expect(result).toBe('<@&987654321098765432>');
        });
    });

    describe('channelMention', () => {
        it('should format channel mentions', () => {
            const result = FormatUtils.channelMention('123456789012345678');
            expect(result).toBe('<#123456789012345678>');
        });
    });

    describe('userMention', () => {
        it('should format user mentions', () => {
            const result = FormatUtils.userMention('123456789012345678');
            expect(result).toBe('<@!123456789012345678>');
        });
    });

    describe('commandMention', () => {
        it('should format simple command mentions', () => {
            const mockCommand = {
                name: 'test',
                id: '123456789012345678',
            } as ApplicationCommand;

            const result = FormatUtils.commandMention(mockCommand);
            expect(result).toBe('</test:123456789012345678>');
        });

        it('should format command mentions with subcommands', () => {
            const mockCommand = {
                name: 'user',
                id: '123456789012345678',
            } as ApplicationCommand;

            const result = FormatUtils.commandMention(mockCommand, ['info']);
            expect(result).toBe('</user info:123456789012345678>');
        });
    });

    describe('duration', () => {
        it('should format hours correctly', () => {
            const result = FormatUtils.duration(3600000, Locale.EnglishUS);
            expect(result).toBe('1 hour');
        });

        it('should format minutes correctly', () => {
            const result = FormatUtils.duration(60000, Locale.EnglishUS);
            expect(result).toBe('1 minute');
        });

        it('should format seconds correctly', () => {
            const result = FormatUtils.duration(5000, Locale.EnglishUS);
            expect(result).toBe('5 seconds');
        });
    });

    describe('fileSize', () => {
        it('should format bytes to KB correctly', () => {
            const result = FormatUtils.fileSize(1024);
            expect(result).toBe('1.00 KB');
        });

        it('should format bytes to MB correctly', () => {
            const result = FormatUtils.fileSize(1048576);
            expect(result).toBe('1.00 MB');
        });

        it('should handle small byte values', () => {
            const result = FormatUtils.fileSize(100);
            expect(result).toBe('100 B');
        });
    });
});
