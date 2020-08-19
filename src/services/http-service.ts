import fetch, { Response } from 'node-fetch';

export class HttpService {
    public async post(url: string, body: object, authorization: string): Promise<Response> {
        let response = await fetch(url, {
            method: 'post',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw response;
        }
        return response;
    }
}
