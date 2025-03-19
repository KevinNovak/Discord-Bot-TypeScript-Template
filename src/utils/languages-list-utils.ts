type Language = {
    label: string;
    description: string;
    value: string;
    emoji: string;
};

export class LanguagesListUtils {
    private static languages: Language[] = [
        { label: 'Arabic', description: 'العربية', value: 'ar', emoji: '🇦🇪' },
        { label: 'Chinese', description: '中文', value: 'zh', emoji: '🇨🇳' },
        { label: 'Czech', description: 'Čeština', value: 'cs', emoji: '🇨🇿' },
        { label: 'Dutch', description: 'Nederlands', value: 'nl', emoji: '🇳🇱' },
        { label: 'English', description: 'English', value: 'en', emoji: '🇬🇧' },
        { label: 'French', description: 'Français', value: 'fr', emoji: '🇫🇷' },
        { label: 'German', description: 'Deutsch', value: 'de', emoji: '🇩🇪' },
        // { label: 'Hindi', description: 'हिन्दी', value: 'hi', emoji: '🇮🇳' }, // TODO: Activer ces langues si besoin
        // { label: 'Hinglish', description: 'Hinglish', value: 'hi-Latn', emoji: '🇮🇳' },
        // { label: 'Indonesian', description: 'Bahasa Indonesia', value: 'id', emoji: '🇮🇩' },
        { label: 'Italian', description: 'Italiano', value: 'it', emoji: '🇮🇹' },
        { label: 'Japanese', description: '日本語', value: 'ja', emoji: '🇯🇵' },
        { label: 'Korean', description: '한국어', value: 'ko', emoji: '🇰🇷' },
        { label: 'Polish', description: 'Polski', value: 'pl', emoji: '🇵🇱' },
        { label: 'Portuguese', description: 'Português', value: 'pt', emoji: '🇵🇹' },
        { label: 'Russian', description: 'Русский', value: 'ru', emoji: '🇷🇺' },
        { label: 'Spanish', description: 'Español', value: 'es', emoji: '🇪🇸' }
    ];

    public static getLanguages(): Language[] {
        return this.languages;
    }

    public static getFlagByValue(value: string): string | undefined {
        const language = this.languages.find(lang => lang.value === value);
        return language ? language.emoji : undefined;
    }

    public static getLabelByValue(value: string): string | undefined {
        const language = this.languages.find(lang => lang.value === value);
        return language ? language.label : undefined;
    }
}