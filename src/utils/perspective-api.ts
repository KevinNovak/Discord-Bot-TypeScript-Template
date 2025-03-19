import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Define the shape of configuration
interface Config {
    perspective: {
        KEYS: string[];
    };
}

// Interface for analysis results
export interface PerspectiveAnalysisResult {
    isSuccessful: boolean;
    error?: string;
    scores?: {
        TOXICITY?: number;
        SEVERE_TOXICITY?: number;
        IDENTITY_ATTACK?: number;
        INSULT?: number;
        PROFANITY?: number;
        THREAT?: number;
        SEXUALLY_EXPLICIT?: number;
    };
    languages?: string[];
    spanScores?: Record<string, any>;
}

/**
 * Class for interacting with Google's Perspective API
 * Analyzes text for toxicity and other harmful content
 */
export class PerspectiveAPI {
    private readonly DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';
    private keys: string[] = [];
    private currentKeyIndex = 0;
    private client: any = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    /**
     * Initialize the Perspective API client
     */
    constructor() {
        this.loadApiKeys();
        this.initPromise = this.initializeClient();
    }

    /**
     * Load API keys from configuration
     */
    private loadApiKeys(): void {
        try {
            const configPath = path.resolve(process.cwd(), 'config', 'config.json');
            const configFile = fs.readFileSync(configPath, 'utf-8');
            const config: Config = JSON.parse(configFile);

            if (config?.perspective?.KEYS?.length > 0) {
                this.keys = config.perspective.KEYS;
            } else {
                console.error('No Perspective API keys found in config file');
            }
        } catch (error) {
            console.error('Error loading Perspective API keys:', error);
        }
    }

    /**
     * Initialize the Google API client
     */
    private async initializeClient(): Promise<void> {
        if (this.keys.length === 0) {
            console.error('Cannot initialize Perspective API client: No API keys available');
            return;
        }

        try {
            this.client = await google.discoverAPI(this.DISCOVERY_URL);
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing Perspective API client:', error);
        }
    }

    /**
     * Get the next API key in the rotation
     */
    private getNextApiKey(): string {
        if (this.keys.length === 0) {
            throw new Error('No Perspective API keys available');
        }

        const key = this.keys[this.currentKeyIndex];
        // Move to the next key for the next request
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
        return key;
    }

    /**
     * Analyze text for toxicity and other attributes
     * @param text The text to analyze (e.g., a confession)
     * @param requestedAttributes Specific attributes to analyze
     * @param languages Array of language codes to hint for analysis
     * @returns Analysis results with scores and detected languages
     */
    public async analyzeText(
        text: string,
        requestedAttributes: string[] = ['TOXICITY'],
        languages?: string[]
    ): Promise<PerspectiveAnalysisResult> {
        // Ensure client is initialized
        if (!this.isInitialized) {
            if (this.initPromise) {
                await this.initPromise;
            } else {
                await this.initializeClient();
            }

            if (!this.isInitialized) {
                return {
                    isSuccessful: false,
                    error: 'Failed to initialize Perspective API client'
                };
            }
        }

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return {
                isSuccessful: false,
                error: 'No text provided for analysis'
            };
        }

        try {
            const apiKey = this.getNextApiKey();

            // Build requested attributes object
            const attributesObj: Record<string, {}> = {};
            requestedAttributes.forEach(attr => {
                attributesObj[attr] = {};
            });

            const analyzeRequest: any = {
                comment: {
                    text: text
                },
                requestedAttributes: attributesObj
            };

            // Add language hints if provided
            if (languages && languages.length > 0) {
                analyzeRequest.languages = languages;
            }

            // Make the API request
            const response = await this.client.comments.analyze({
                key: apiKey,
                resource: analyzeRequest
            });

            // Extract the scores and languages from response
            const result: PerspectiveAnalysisResult = {
                isSuccessful: true,
                scores: {},
                languages: response.data.languages || []
            };

            // Extract all attribute scores
            if (response.data.attributeScores) {
                Object.keys(response.data.attributeScores).forEach(attribute => {
                    if (response.data.attributeScores[attribute]?.summaryScore?.value !== undefined) {
                        result.scores![attribute] = response.data.attributeScores[attribute].summaryScore.value;
                    }
                });

                // Optionally store detailed span scores if needed
                result.spanScores = {};
                Object.keys(response.data.attributeScores).forEach(attribute => {
                    if (response.data.attributeScores[attribute]?.spanScores) {
                        result.spanScores![attribute] = response.data.attributeScores[attribute].spanScores;
                    }
                });
            }

            return result;
        } catch (error: any) {
            return {
                isSuccessful: false,
                error: error.message || 'Error analyzing text with Perspective API'
            };
        }
    }

    /**
     * Check if a text exceeds toxicity thresholds
     * @param text The text to analyze
     * @param thresholds Score thresholds for different attributes
     * @returns Whether the text is toxic and why
     */
    public async isToxic(
        text: string,
        thresholds: Partial<Record<string, number>> = { TOXICITY: 0.90}
    ): Promise<{ isToxic: boolean; scores?: Record<string, number> }> {
        const result = await this.analyzeText(text, Object.keys(thresholds));

        if (!result.isSuccessful || !result.scores) {
            return {
                isToxic: false,
            };
        }

        let isToxic = false;

        // Check each attribute against its threshold
        Object.entries(thresholds).forEach(([attribute, threshold]) => {
            const score = result.scores![attribute];
            if (score !== undefined && score >= threshold) {
                isToxic = true;
            }
        });

        return {
            isToxic,
            scores: result.scores
        };
    }
}

// Export a default instance for quick use
export const perspectiveApi = new PerspectiveAPI();