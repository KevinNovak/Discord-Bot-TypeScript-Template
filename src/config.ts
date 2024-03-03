import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let Config = require('../config/config.json');

interface Config {
    discord: {
        token: string;
    };
}

export const config: Config = {
    discord: {
        token: Config.client.token ?? process.env.DISCORD_TOKEN,
    },
};
