/**
 * Configuration options for spam detection
 */
export interface SpamDetectionOptions {
    // Maximum acceptable percentage of uppercase characters (0-100)
    maxUppercasePercentage: number;
    // Maximum acceptable percentage of same character repetition (0-100)
    maxRepeatedCharPercentage: number;
    // Maximum number of consecutive repeated characters
    maxConsecutiveRepeatedChars: number;
    // Maximum acceptable percentage of special characters (0-100)
    maxSpecialCharPercentage: number;
    // Minimum text length for detection to apply
    minTextLength: number;
    // Maximum acceptable line breaks per length ratio
    maxLineBreakRatio: number;
    // Maximum length of a single word
    maxWordLength: number;
    // Character sets considered as zalgo (combining diacritical marks)
    zalgoRanges: Array<[number, number]>;
    // Maximum percentage of zalgo characters allowed
    maxZalgoPercentage: number;
    // Language-specific adjustments
    languageAdjustments: {
        // Scripts that should bypass uppercase detection
        scriptsExemptFromUppercase: Array<[number, number]>;
        // Scripts with different word boundary concepts
        nonSpacedScripts: Array<[number, number]>;
        // Scripts with unique repetition patterns
        scriptsWithDifferentRepetition: Array<[number, number]>;
    };
}

/**
 * Default configuration for spam detection with language awareness
 */
/**
 * Default configuration for spam detection with language awareness
 * Configured for light moderation to minimize false positives
 */
export const defaultSpamOptions: SpamDetectionOptions = {
    // Increased from 80 to 90 - only flag text that is almost entirely uppercase
    maxUppercasePercentage: 90,
    
    // Increased from 45 to 60 - allow more character repetition for expressive writing
    maxRepeatedCharPercentage: 60,
    
    // Increased from 8 to 12 - allow more consecutive repeats (like "hellooooooooooo")
    maxConsecutiveRepeatedChars: 12,
    
    // Increased from 40 to 50 - more tolerant of special characters for stylistic writing
    maxSpecialCharPercentage: 50,
    
    // Kept at 5 - still reasonable for minimum text length
    minTextLength: 5,
    
    // Increased from 0.5 to 0.7 - more tolerant of line breaks
    maxLineBreakRatio: 0.7,
    
    // Increased from 50 to 75 - accommodate longer compound words in some languages
    maxWordLength: 75,
    
    // Kept zalgo ranges the same - these are specific Unicode ranges
    zalgoRanges: [
        [768, 879],   // Combining Diacritical Marks
        [7616, 7679], // Combining Diacritical Marks for Symbols
        [8400, 8447]  // Combining Diacritical Marks Supplement
    ],
    
    // Increased from 5 to 10 - more tolerant of diacritical marks (important for many languages)
    maxZalgoPercentage: 10,
    
    // Language-specific adjustments remain the same
    languageAdjustments: {
        // Scripts that don't have uppercase/lowercase distinction
        scriptsExemptFromUppercase: [
            [0x3040, 0x309F],   // Hiragana
            [0x30A0, 0x30FF],   // Katakana
            [0x4E00, 0x9FFF],   // CJK Unified Ideographs (Chinese, Japanese Kanji)
            [0x1100, 0x11FF],   // Hangul Jamo (Korean)
            [0xAC00, 0xD7AF],   // Hangul Syllables (Korean)
            [0x0600, 0x06FF],   // Arabic
            [0x0900, 0x097F],   // Devanagari (Hindi)
            [0x0400, 0x04FF]    // Cyrillic (Russian)
        ],
        // Scripts that don't use spaces for word boundaries
        nonSpacedScripts: [
            [0x4E00, 0x9FFF],   // CJK Unified Ideographs
            [0x3040, 0x309F],   // Hiragana
            [0x30A0, 0x30FF],   // Katakana
        ],
        // Scripts with different repetition patterns
        scriptsWithDifferentRepetition: [
            [0x4E00, 0x9FFF],   // CJK Unified Ideographs
            [0x0600, 0x06FF],   // Arabic
        ]
    }
};

/**
 * The result of spam detection containing details about why a message is considered spam
 */
export interface SpamDetectionResult {
    isSpam: boolean;
    reasons: string[];
    statistics: {
        uppercasePercentage?: number;
        repeatedCharPercentage?: number;
        specialCharPercentage?: number;
        lineBreakRatio?: number;
        zalgoPercentage?: number;
        longestWordLength?: number;
        longestConsecutiveRepeats?: number;
        detectedLanguageScripts?: string[];
    };
}

/**
 * Class to detect various kinds of spam and zalgo text with multi-language support
 */
export class SpamDetector {
    private options: SpamDetectionOptions;

    /**
     * Initialize the spam detector with optional custom configuration
     * @param options Custom spam detection options (optional)
     */
    constructor(options?: Partial<SpamDetectionOptions>) {
        this.options = {
            ...defaultSpamOptions,
            ...options,
            languageAdjustments: {
                ...defaultSpamOptions.languageAdjustments,
                ...(options?.languageAdjustments || {})
            }
        };
    }

    /**
     * Detect if a text is likely spam or zalgo text
     * @param text The text to analyze
     * @returns Detection result with spam status and reasons
     */
    public detectSpam(text: string): SpamDetectionResult {
        if (!text || typeof text !== 'string' || text.length < this.options.minTextLength) {
            return { isSpam: false, reasons: [], statistics: {} };
        }

        const result: SpamDetectionResult = {
            isSpam: false,
            reasons: [],
            statistics: {
                detectedLanguageScripts: []
            }
        };

        // Detect scripts used in the text
        const scriptRanges = this.detectScripts(text);
        result.statistics.detectedLanguageScripts = scriptRanges;

        // Check for excessive uppercase (skip for scripts without case distinction)
        const shouldCheckUppercase = !this.isTextMainlyNonCaseScript(text);
        if (shouldCheckUppercase) {
            const upperCaseCount = (text.match(/[A-Z\u00C0-\u00DD\u0400-\u042F]/g) || []).length;
            const alphaCount = (text.match(/[\p{L}]/gu) || []).length;
            
            if (alphaCount > 0) {
                const uppercasePercentage = (upperCaseCount / alphaCount) * 100;
                result.statistics.uppercasePercentage = Math.round(uppercasePercentage);
                
                if (uppercasePercentage > this.options.maxUppercasePercentage) {
                    result.isSpam = true;
                    result.reasons.push('Excessive uppercase characters');
                }
            }
        }

        // Check for repeated characters with language-specific adjustments
        const isNonLatinScript = this.isTextMainlyNonLatinScript(text);
        const { repeatedCharPercentage, longestConsecutiveRepeats } = this.analyzeRepeatedChars(text);
        result.statistics.repeatedCharPercentage = Math.round(repeatedCharPercentage);
        result.statistics.longestConsecutiveRepeats = longestConsecutiveRepeats;
        
        // Apply different thresholds for repetition in non-Latin scripts
        const adjustedMaxRepeatedPercentage = isNonLatinScript 
            ? this.options.maxRepeatedCharPercentage * 1.5 // 50% higher threshold for non-Latin
            : this.options.maxRepeatedCharPercentage;
            
        const adjustedMaxConsecutive = isNonLatinScript
            ? this.options.maxConsecutiveRepeatedChars * 1.5 // 50% higher threshold for non-Latin
            : this.options.maxConsecutiveRepeatedChars;
            
        if (repeatedCharPercentage > adjustedMaxRepeatedPercentage) {
            result.isSpam = true;
            result.reasons.push('Excessive repeated characters');
        }
        
        if (longestConsecutiveRepeats > adjustedMaxConsecutive) {
            result.isSpam = true;
            result.reasons.push('Too many consecutive repeated characters');
        }

        // Check for excessive special characters
        const specialCharCount = (text.match(/[^\p{L}\p{N}\s]/gu) || []).length;
        const specialCharPercentage = (specialCharCount / text.length) * 100;
        result.statistics.specialCharPercentage = Math.round(specialCharPercentage);
        
        if (specialCharPercentage > this.options.maxSpecialCharPercentage) {
            result.isSpam = true;
            result.reasons.push('Excessive special characters');
        }

        // Check for excessive line breaks
        const lineBreaks = (text.match(/\n/g) || []).length;
        const lineBreakRatio = lineBreaks / text.length;
        result.statistics.lineBreakRatio = lineBreakRatio;
        
        if (lineBreakRatio > this.options.maxLineBreakRatio) {
            result.isSpam = true;
            result.reasons.push('Excessive line breaks');
        }

        // Check for extremely long words (adjusting for languages without spaces)
        if (!this.isTextMainlyNonSpacedScript(text)) {
            const words = text.split(/\s+/);
            const longestWordLength = Math.max(...words.map(word => word.length));
            result.statistics.longestWordLength = longestWordLength;
            
            if (longestWordLength > this.options.maxWordLength) {
                result.isSpam = true;
                result.reasons.push('Extremely long words');
            }
        }

        // Check for zalgo text (text with combining characters)
        const zalgoPercentage = this.calculateZalgoPercentage(text);
        result.statistics.zalgoPercentage = Math.round(zalgoPercentage);
        
        if (zalgoPercentage > this.options.maxZalgoPercentage) {
            result.isSpam = true;
            result.reasons.push('Contains zalgo/combining characters');
        }

        return result;
    }

    /**
     * Detect which scripts (writing systems) are used in the text
     */
    private detectScripts(text: string): string[] {
        const scripts = new Set<string>();
        
        const scriptRanges: Record<string, [number, number]> = {
            'Latin': [0x0000, 0x024F],
            'Cyrillic': [0x0400, 0x04FF],
            'Arabic': [0x0600, 0x06FF],
            'Devanagari': [0x0900, 0x097F],
            'Hiragana': [0x3040, 0x309F],
            'Katakana': [0x30A0, 0x30FF],
            'CJK': [0x4E00, 0x9FFF],
            'Hangul': [0xAC00, 0xD7AF]
        };
        
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            for (const [script, [start, end]] of Object.entries(scriptRanges)) {
                if (charCode >= start && charCode <= end) {
                    scripts.add(script);
                    break;
                }
            }
        }
        
        return Array.from(scripts);
    }

    /**
     * Check if text is primarily in scripts without case distinction
     */
    private isTextMainlyNonCaseScript(text: string): boolean {
        const noCaseChars = this.countCharsInRanges(
            text, 
            this.options.languageAdjustments.scriptsExemptFromUppercase
        );
        
        return noCaseChars / text.length > 0.5; // If more than 50% is from non-case script
    }

    /**
     * Check if text is primarily in scripts that don't use spaces
     */
    private isTextMainlyNonSpacedScript(text: string): boolean {
        const nonSpacedChars = this.countCharsInRanges(
            text, 
            this.options.languageAdjustments.nonSpacedScripts
        );
        
        return nonSpacedChars / text.length > 0.5; // If more than 50% is from non-spaced script
    }

    /**
     * Check if text is primarily non-Latin script
     */
    private isTextMainlyNonLatinScript(text: string): boolean {
        // Latin script ranges
        const latinChars = this.countCharsInRanges(text, [[0x0000, 0x024F]]);
        return latinChars / text.length < 0.5; // If less than 50% is Latin
    }

    /**
     * Count characters that fall within specified Unicode ranges
     */
    private countCharsInRanges(text: string, ranges: Array<[number, number]>): number {
        let count = 0;
        
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            for (const [start, end] of ranges) {
                if (charCode >= start && charCode <= end) {
                    count++;
                    break;
                }
            }
        }
        
        return count;
    }

    /**
     * Analyze the percentage and patterns of repeated characters in text
     */
    private analyzeRepeatedChars(text: string): { 
        repeatedCharPercentage: number; 
        longestConsecutiveRepeats: number 
    } {
        let repeatedCharCount = 0;
        let longestConsecutiveRepeats = 1;
        let currentConsecutiveCount = 1;
        
        for (let i = 1; i < text.length; i++) {
            if (text[i] === text[i - 1] && text[i].trim() !== '') {
                repeatedCharCount++;
                currentConsecutiveCount++;
                longestConsecutiveRepeats = Math.max(longestConsecutiveRepeats, currentConsecutiveCount);
            } else {
                currentConsecutiveCount = 1;
            }
        }
        
        const repeatedCharPercentage = (repeatedCharCount / text.length) * 100;
        return { repeatedCharPercentage, longestConsecutiveRepeats };
    }

    /**
     * Calculate the percentage of zalgo (combining) characters in text
     */
    private calculateZalgoPercentage(text: string): number {
        let zalgoCount = 0;
        
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const isZalgo = this.options.zalgoRanges.some(
                ([start, end]) => charCode >= start && charCode <= end
            );
            
            if (isZalgo) {
                zalgoCount++;
            }
        }
        
        return (zalgoCount / text.length) * 100;
    }

    /**
     * Update the spam detection configuration
     * @param options New options to apply
     */
    public updateOptions(options: Partial<SpamDetectionOptions>): void {
        this.options = {
            ...this.options,
            ...options,
            languageAdjustments: {
                ...this.options.languageAdjustments,
                ...(options.languageAdjustments || {})
            }
        };
    }

    /**
     * Get the current spam detection configuration
     * @returns Current options
     */
    public getOptions(): SpamDetectionOptions {
        return { ...this.options };
    }

    /**
     * Reset spam detection options to defaults
     */
    public resetOptions(): void {
        this.options = { ...defaultSpamOptions };
    }
}

// Export a default instance for quick use
export const defaultSpamDetector = new SpamDetector();

// Simple function to check if text is spam
export const isSpam = (text: string, options?: Partial<SpamDetectionOptions>): SpamDetectionResult => {
    const detector = new SpamDetector(options);
    return detector.detectSpam(text);
};