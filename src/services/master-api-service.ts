import { URL } from 'url';

import { HttpService } from '.';
import { LoginClusterRequest, LoginClusterResponse } from '../models/master-api/clusters';

let Config = require('../../config/config.json');

export class MasterApiService {
    constructor(private httpService: HttpService) {}

    public async login(): Promise<LoginClusterResponse> {
        let reqBody: LoginClusterRequest = {
            shardCount: Config.clustering.shardCount,
            callback: {
                url: Config.clustering.callbackUrl,
                token: Config.api.secret,
            },
        };

        let res = await this.httpService.post(
            new URL(`/clusters/${Config.clustering.clusterId}`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token,
            reqBody
        );

        if (!res.ok) {
            throw res;
        }

        return await res.json();
    }
}
