import { LangCode } from './enums';

// This class is used to store and pass data along in events
export class EventData {
    constructor() {
        // Pass in event data from constructor
    }

    public lang(): LangCode {
        // Lang can be calculate based on event data
        return LangCode.EN_US;
    }
}
