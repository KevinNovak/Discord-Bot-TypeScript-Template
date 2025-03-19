import { describe, it, expect, vi } from 'vitest';
import { MathUtils } from '../../src/utils/index.js';

describe('MathUtils', () => {
    describe('sum', () => {
        it('should correctly sum an array of numbers', () => {
            const input = [1, 2, 3, 4, 5];
            const result = MathUtils.sum(input);
            expect(result).toBe(15);
        });

        it('should return 0 for an empty array', () => {
            const result = MathUtils.sum([]);
            expect(result).toBe(0);
        });

        it('should handle negative numbers correctly', () => {
            const input = [-1, -2, 3, 4];
            const result = MathUtils.sum(input);
            expect(result).toBe(4);
        });
    });

    describe('clamp', () => {
        it('should return the input value when within range', () => {
            const result = MathUtils.clamp(5, 1, 10);
            expect(result).toBe(5);
        });

        it('should return the min value when input is too low', () => {
            const result = MathUtils.clamp(0, 1, 10);
            expect(result).toBe(1);
        });

        it('should return the max value when input is too high', () => {
            const result = MathUtils.clamp(15, 1, 10);
            expect(result).toBe(10);
        });

        it('should handle negative ranges correctly', () => {
            const result = MathUtils.clamp(-5, -10, -2);
            expect(result).toBe(-5);
        });
    });

    describe('range', () => {
        it('should create an array of sequential numbers from start', () => {
            const result = MathUtils.range(5, 3);
            expect(result).toEqual([5, 6, 7]);
        });

        it('should create an empty array when size is 0', () => {
            const result = MathUtils.range(10, 0);
            expect(result).toEqual([]);
        });

        it('should handle negative start values', () => {
            const result = MathUtils.range(-3, 4);
            expect(result).toEqual([-3, -2, -1, 0]);
        });
    });

    describe('ceilToMultiple', () => {
        it('should round up to the nearest multiple', () => {
            const result = MathUtils.ceilToMultiple(14, 5);
            expect(result).toBe(15);
        });

        it('should not change value already at multiple', () => {
            const result = MathUtils.ceilToMultiple(15, 5);
            expect(result).toBe(15);
        });

        it('should handle decimal inputs correctly', () => {
            const result = MathUtils.ceilToMultiple(10.5, 5);
            expect(result).toBe(15);
        });

        it('should handle negative values correctly', () => {
            const result = MathUtils.ceilToMultiple(-12, 5);
            expect(result).toBe(-10);
        });
    });
});
