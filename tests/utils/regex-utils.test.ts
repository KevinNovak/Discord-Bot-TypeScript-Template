import { describe, expect, it, vi } from 'vitest';

import { RegexUtils } from '../../src/utils/index.js';

// Mock any configs that might be loaded
vi.mock('../../config/config.json', () => ({}));
vi.mock('../../config/debug.json', () => ({}));
vi.mock('../../lang/logs.json', () => ({}));

describe('RegexUtils', () => {
    describe('discordId', () => {
        it('should extract a valid Discord ID', () => {
            const input = 'User ID: 123456789012345678';
            const result = RegexUtils.discordId(input);
            expect(result).toBe('123456789012345678');
        });

        it('should return undefined for invalid Discord ID', () => {
            const input = 'User ID: 12345';
            const result = RegexUtils.discordId(input);
            expect(result).toBeUndefined();
        });
    });
});
