import * as rp from 'request-promise';

export class HttpService {
    public async post(url: string, body: any, authorization: string): Promise<void> {
        await rp.post(url, { body, json: true, headers: { Authorization: authorization } });
    }
}
