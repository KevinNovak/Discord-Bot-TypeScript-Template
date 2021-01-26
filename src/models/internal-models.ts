import { LangCode } from './enums';

// This class is used to store and pass data along in events
export class EventData {
    public lang: LangCode;

    constructor() {
        this.lang = LangCode.EN_US;
    }
}
