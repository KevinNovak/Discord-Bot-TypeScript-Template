import fetch, { Response } from 'node-fetch';

export class HttpService {
    public async get(url: string, authorization: string): Promise<Response> {
        return await fetch(url, {
            method: 'get',
            headers: {
                Authorization: authorization,
                Accept: 'application/json',
            },
        });
    }

    public async post(url: string, authorization: string, body?: object): Promise<Response> {
        return await fetch(url, {
            method: 'post',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });
    }
}
