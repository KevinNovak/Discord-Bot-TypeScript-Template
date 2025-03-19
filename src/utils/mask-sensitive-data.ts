/**
 * Default masking options with regex patterns for sensitive data
 */
export const defaultMaskOptions = {
    // Pattern for credit card numbers (e.g., "1234 5678 9012 3456")
    bankCardNumberPattern: /([\d]{4}\W){3}[\d]{4}/g,
    // Pattern for email addresses (e.g., "example@domain.com")
    emailPattern: /[\w+\.+\-]+@+[\w+\.+\-]+[\.\w]{2,}/g,
    // Pattern for JWT tokens
    jwtPattern: /eyJ[\w-]+\.eyJ[\w-]+\.[\w-_]+/g,
    // Pattern for phone numbers in various formats
    phoneNumberPattern: /[\+]?[\d]{1,3}?[-\s\.]?[(]?[\d]{1,3}[)]?[-\s\.]?([\d-\s\.]){7,12}/g,
    // Pattern for UUIDs
    uuidPattern: /[\w]{8}\b-[\w]{4}\b-[\w]{4}\b-[\w]{4}\b-[\w]{12}/g,
    // Pattern for URLs
    urlPattern: /(https?:\/\/|www\.)[^\s]+/g,
    // Pattern for IP addresses (IPv4 and IPv6)
    ipV4Pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    ipV6Pattern: /\b(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?::[0-9a-fA-F]{1,4}){1,7}|::)\b/g,
    // Symbol used for masking
    maskSymbol: '#',
    // Maximum characters to mask in a single match
    maxCharsToMask: 35,
    // Number of characters to leave visible from start
    visibleCharsFromStart: 6,
    // Number of characters to leave visible from end
    visibleCharsFromEnd: 4,
};

/**
 * Class to handle masking of sensitive data in text content
 * Masks credit card numbers, emails, JWT tokens, phone numbers, URLs, and UUIDs
 */
export class SensitiveDataMasker {
    // Configuration options
    private maskOptions: typeof defaultMaskOptions;

    /**
     * Initialize the masker with optional custom configuration
     * @param options Custom masking options (optional)
     */
    constructor(options?: Partial<typeof defaultMaskOptions>) {
        this.maskOptions = {
            ...defaultMaskOptions,
            ...options
        };
    }

    /**
     * Mask sensitive data in a text string
     * @param text The text to process (e.g., a confession)
     * @returns The same text with sensitive data masked
     */
    public maskText(text: string): { maskedText: string; isMasked: boolean } {
        if (!text || typeof text !== 'string') {
            return { maskedText: text, isMasked: false };
        }

        let maskedText = text;
        let isMasked = false;

        // Apply masking for each type of sensitive data
        if (this.maskOptions.bankCardNumberPattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.bankCardNumberPattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.emailPattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.emailPattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.jwtPattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.jwtPattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.phoneNumberPattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.phoneNumberPattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.uuidPattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.uuidPattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.urlPattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.urlPattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.ipV4Pattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.ipV4Pattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        if (this.maskOptions.ipV6Pattern) {
            const result = this.applyMaskingPattern(maskedText, this.maskOptions.ipV6Pattern);
            if (result !== maskedText) isMasked = true;
            maskedText = result;
        }

        return { maskedText, isMasked };
    }

    /**
     * Applies masking to all matches of a pattern in the text
     * @param text The text to process
     * @param pattern Regex pattern to match sensitive data
     * @returns Text with masked content
     */
    private applyMaskingPattern(text: string, pattern: RegExp): string {
        // Create a new RegExp to ensure we get fresh matches
        const regex = new RegExp(pattern.source, pattern.flags);

        return text.replace(regex, (match) => {
            return this.maskString(match);
        });
    }

    /**
     * Mask a single string (e.g., an email or credit card number)
     * @param value The string to mask
     * @returns Masked string
     */
    private maskString(value: string): string {
        const {
            maskSymbol,
            maxCharsToMask,
            visibleCharsFromStart,
            visibleCharsFromEnd
        } = this.maskOptions;

        // Calculate how many characters to mask
        const valueLength = value.length;
        const charsToMask = Math.min(
            valueLength - visibleCharsFromStart - visibleCharsFromEnd,
            maxCharsToMask
        );

        if (charsToMask <= 0) {
            return value;
        }

        // Create masked string
        const startPart = value.substring(0, visibleCharsFromStart);
        const endPart = value.substring(valueLength - visibleCharsFromEnd);
        const maskedPart = maskSymbol.repeat(charsToMask);

        return startPart + maskedPart + endPart;
    }

    /**
     * Update the masking configuration
     * @param options New options to apply
     */
    public updateOptions(options: Partial<typeof defaultMaskOptions>): void {
        this.maskOptions = {
            ...this.maskOptions,
            ...options
        };
    }

    /**
     * Get the current masking configuration
     * @returns Current mask options
     */
    public getOptions(): typeof defaultMaskOptions {
        return { ...this.maskOptions };
    }

    /**
     * Reset masking options to defaults
     */
    public resetOptions(): void {
        this.maskOptions = { ...defaultMaskOptions };
    }
}

// Export a default instance for quick use
export const defaultMasker = new SensitiveDataMasker();

// Also export the maskString function separately
export const maskString = (value: string, options?: Partial<typeof defaultMaskOptions>): string => {
    const masker = new SensitiveDataMasker(options);
    return masker.maskText(value).maskedText;
};