import fetch, { Response } from 'node-fetch';
import { URL } from 'url';

export class HttpService {
    public async get(url: string | URL, authorization: string): Promise<Response> {
        return await fetch(url, {
            method: 'get',
            headers: {
                Authorization: authorization,
                Accept: 'application/json',
            },
        });
    }

    public async post(url: string | URL, authorization: string, body?: object): Promise<Response> {
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
