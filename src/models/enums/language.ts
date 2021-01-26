import { Lang } from '../../services';

export enum LangCode {
    EN_US = 'en-US',
}

export class Language {
    public static keyword(langCode: LangCode): RegExp {
        return Lang.getRegex('meta.language', langCode);
    }

    public static regex(langCode: LangCode): RegExp {
        return Lang.getRegex('meta.language', langCode);
    }

    public static displayName(langCode: LangCode): string {
        return Lang.getRef('meta.languageDisplay', langCode);
    }

    public static find(input: string): LangCode {
        for (let key of Object.keys(LangCode)) {
            let langCode: LangCode = LangCode[key];
            if (this.regex(langCode).test(input)) {
                return langCode;
            }
        }
    }
}
