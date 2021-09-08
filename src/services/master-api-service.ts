import { URL } from 'url';

import { HttpService } from '.';
import {
    LoginClusterResponse,
    RegisterClusterRequest,
    RegisterClusterResponse,
} from '../models/master-api';

let Config = require('../../config/config.json');

export class MasterApiService {
    private clusterId: string;

    constructor(private httpService: HttpService) {}

    public async register(): Promise<void> {
        let reqBody: RegisterClusterRequest = {
            shardCount: Config.clustering.shardCount,
            callback: {
                url: Config.clustering.callbackUrl,
                token: Config.api.secret,
            },
        };

        let res = await this.httpService.post(
            new URL('/clusters', Config.clustering.masterApi.url),
            Config.clustering.masterApi.token,
            reqBody
        );

        if (!res.ok) {
            throw res;
        }

        let resBody: RegisterClusterResponse = await res.json();
        this.clusterId = resBody.id;
    }

    public async login(): Promise<LoginClusterResponse> {
        let res = await this.httpService.put(
            new URL(`/clusters/${this.clusterId}/login`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token
        );

        if (!res.ok) {
            throw res;
        }

        return res.json();
    }

    public async ready(): Promise<void> {
        let res = await this.httpService.put(
            new URL(`/clusters/${this.clusterId}/ready`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token
        );

        if (!res.ok) {
            throw res;
        }
    }
}
