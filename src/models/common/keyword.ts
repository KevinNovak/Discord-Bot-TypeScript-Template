import { LangCode } from '../enums';

export interface Keyword {
    keyword(langCode: LangCode): string;
    regex(langCode: LangCode): RegExp;
}
