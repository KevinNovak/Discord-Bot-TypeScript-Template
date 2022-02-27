import { LangCode } from '../enums/index.js';
import { Lang } from '../services/index.js';

// This class is used to store and pass data along in events
export class EventData {
    constructor() {
        // TODO: Pass in event data (e.g. server and user data) from constructor
    }

    public lang(): LangCode {
        // TODO: Calculate language based on event data
        return Lang.Default;
    }
}
