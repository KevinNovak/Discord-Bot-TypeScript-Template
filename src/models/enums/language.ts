import { Lang } from '../../services';

export enum LangCode {
    EN = 'EN',
}

export class Language {
    public static displayName(langCode: LangCode): string {
        return Lang.getRef('meta.language', langCode);
    }

    public static find(input: string): LangCode {
        return LangCode[input.toUpperCase()];
    }
}
