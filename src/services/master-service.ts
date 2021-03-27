import { URL } from 'url';

import { HttpService } from '.';

let Config = require('../../config/config.json');

export class MasterService {
    constructor(private httpService: HttpService) {}

    public async myShardIds(): Promise<number[]> {
        let res = await this.httpService.post(
            new URL(`/clusters/${Config.clustering.clusterId}`, Config.clustering.masterApi.url),
            Config.clustering.masterApi.token,
            {
                callback: {
                    url: Config.clustering.callbackUrl,
                    token: Config.api.secret,
                },
                shardCount: Config.clustering.shardCount,
            }
        );

        if (!res.ok) {
            throw res;
        }

        return await res.json();
    }
}
