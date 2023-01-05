import { Locale } from 'discord.js';

interface LanguageData {
    englishName: string;
    nativeName: string;
}

export class Language {
    public static Default = Locale.EnglishUS;
    public static Enabled: Locale[] = [Locale.EnglishUS, Locale.EnglishGB];

    // See https://discord.com/developers/docs/reference#locales
    public static Data: {
        [key in Locale]: LanguageData;
    } = {
        bg: { englishName: 'Bulgarian', nativeName: 'български' },
        cs: { englishName: 'Czech', nativeName: 'Čeština' },
        da: { englishName: 'Danish', nativeName: 'Dansk' },
        de: { englishName: 'German', nativeName: 'Deutsch' },
        el: { englishName: 'Greek', nativeName: 'Ελληνικά' },
        'en-GB': { englishName: 'English, UK', nativeName: 'English, UK' },
        'en-US': { englishName: 'English, US', nativeName: 'English, US' },
        'es-ES': { englishName: 'Spanish', nativeName: 'Español' },
        fi: { englishName: 'Finnish', nativeName: 'Suomi' },
        fr: { englishName: 'French', nativeName: 'Français' },
        hi: { englishName: 'Hindi', nativeName: 'हिन्दी' },
        hr: { englishName: 'Croatian', nativeName: 'Hrvatski' },
        hu: { englishName: 'Hungarian', nativeName: 'Magyar' },
        id: { englishName: 'Indonesian', nativeName: 'Bahasa Indonesia' },
        it: { englishName: 'Italian', nativeName: 'Italiano' },
        ja: { englishName: 'Japanese', nativeName: '日本語' },
        ko: { englishName: 'Korean', nativeName: '한국어' },
        lt: { englishName: 'Lithuanian', nativeName: 'Lietuviškai' },
        nl: { englishName: 'Dutch', nativeName: 'Nederlands' },
        no: { englishName: 'Norwegian', nativeName: 'Norsk' },
        pl: { englishName: 'Polish', nativeName: 'Polski' },
        'pt-BR': { englishName: 'Portuguese, Brazilian', nativeName: 'Português do Brasil' },
        ro: { englishName: 'Romanian, Romania', nativeName: 'Română' },
        ru: { englishName: 'Russian', nativeName: 'Pусский' },
        'sv-SE': { englishName: 'Swedish', nativeName: 'Svenska' },
        th: { englishName: 'Thai', nativeName: 'ไทย' },
        tr: { englishName: 'Turkish', nativeName: 'Türkçe' },
        uk: { englishName: 'Ukrainian', nativeName: 'Українська' },
        vi: { englishName: 'Vietnamese', nativeName: 'Tiếng Việt' },
        'zh-CN': { englishName: 'Chinese, China', nativeName: '中文' },
        'zh-TW': { englishName: 'Chinese, Taiwan', nativeName: '繁體中文' },
    };

    public static find(input: string, enabled: boolean): Locale {
        return this.findMultiple(input, enabled, 1)[0];
    }

    public static findMultiple(
        input: string,
        enabled: boolean,
        limit: number = Number.MAX_VALUE
    ): Locale[] {
        let langCodes = enabled ? this.Enabled : Object.values(Locale).sort();
        let search = input.toLowerCase();
        let found = new Set<Locale>();
        // Exact match
        if (found.size < limit)
            langCodes
                .filter(langCode => langCode.toLowerCase() === search)
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode => this.Data[langCode].nativeName.toLowerCase() === search)
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode => this.Data[langCode].nativeName.toLowerCase() === search)
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode => this.Data[langCode].englishName.toLowerCase() === search)
                .forEach(langCode => found.add(langCode));
        // Starts with search term
        if (found.size < limit)
            langCodes
                .filter(langCode => langCode.toLowerCase().startsWith(search))
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode => this.Data[langCode].nativeName.toLowerCase().startsWith(search))
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode =>
                    this.Data[langCode].englishName.toLowerCase().startsWith(search)
                )
                .forEach(langCode => found.add(langCode));
        // Includes search term
        if (found.size < limit)
            langCodes
                .filter(langCode => langCode.toLowerCase().startsWith(search))
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode => this.Data[langCode].nativeName.toLowerCase().startsWith(search))
                .forEach(langCode => found.add(langCode));
        if (found.size < limit)
            langCodes
                .filter(langCode =>
                    this.Data[langCode].englishName.toLowerCase().startsWith(search)
                )
                .forEach(langCode => found.add(langCode));
        return [...found];
    }
}
