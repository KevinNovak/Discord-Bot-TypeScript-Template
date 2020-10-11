# Discord TypeScript Sharding Template

[![discord.js](https://img.shields.io/github/package-json/dependency-version/KevinNovak/Discord-TypeScript-Sharding-Template/discord.js)](https://discord.js.org/)

**Discord bot** - A TypeScript Discord bot template with multi-machine sharding and other features.

## Features

* Written with TypeScript and [discord.js](https://discord.js.org/).
* Multi-machine sharding.
* Basic command structure.
* Shows server count in bot presence.
* Posts bot server counts to popular bot sites.
* Support for running with the [PM2](https://pm2.keymetrics.io/) process manger.
* Built-in debugging setup for VSCode.

## Setup

1. Obtain a bot token.
    * You'll need to create a new bot in your [Discord Developer Portal](https://discordapp.com/developers/applications/).
        * See [here](https://www.writebots.com/discord-bot-token/) for detailed instructions.
        * At the end you should have a **bot token**.
2. Modify the config file.
    * Open the `config/config.json` file.
    * You'll need to edit the following values:
        * `client.token` - Your discord bot token.
3. Install packages.
    * Navigate into the downloaded source files and type `npm install`.

## Start Scripts

You can run the bot in 3 different modes:

1. Non-Shard Mode
    * Type `npm start`.
    * This runs the bot directly with Node and without shards.
    * Use this mode for general development.
2. Shard Mode
    * Type `npm run start-shard`.
    * This runs the bot directly with Node and with sharding enabled.
    * Use this mode if you are testing sharding.
3. PM2 Mode
    * Run by typing `npm run start-pm2`.
    * This runs the bot using the process manager [PM2](https://pm2.keymetrics.io/).
    * Use this mode if you require the bot to always be online.

## Commands

This bot has a few example commands which can be modified as needed.

### Help Command

![Help Command](https://i.imgur.com/zOSyaNl.png)

### Test Command

![Test Command](https://i.imgur.com/rzpdTVA.png)

### Info Command

![Info Command](https://i.imgur.com/xw2H8th.png)

## References

* [discord.js](https://discord.js.org/) - A powerful JavaScript library for interacting with the Discord API.
* [Node Schedule](https://github.com/node-schedule/node-schedule) - A cron-like job scheduler for Node.
