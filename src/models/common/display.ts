import { LangCode } from '../enums';

export interface Display {
    displayName(langCode: LangCode): string;
}
