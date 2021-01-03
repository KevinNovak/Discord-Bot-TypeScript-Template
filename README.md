# Discord Bot TypeScript Template

[![discord.js](https://img.shields.io/github/package-json/dependency-version/KevinNovak/Discord-Bot-TypeScript-Template/discord.js)](https://discord.js.org/)[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

**Discord bot** - A discord.js bot template written with TypeScript.

## Introduction

This template was created to give developers a starting point for new Discord bots, so that much of the initial setup can be avoided and developers can instead focus on meaningful bot features. Developers can simply copy this repo, follow the [setup instructions](#setup) below, and have a working bot with many [boilerplate features](#features) already included!

For help using this template, feel free to [join our support server](https://discord.gg/Vyf6fEWbVr)!

## Features

-   Written with TypeScript and [discord.js](https://discord.js.org/).
-   Basic command structure.
-   Rate limits for commands.
-   Shows server count in bot status.
-   Posts server count to popular bot list websites.
-   Support for multiple languages.
-   [Sharding](https://discordjs.guide/sharding/) across multiple machines.
-   Built-in debugging setup for VSCode.
-   Support for running with the [PM2](https://pm2.keymetrics.io/) process manger.

## Commands

This bot has a few example commands which can be modified as needed.

### Help Command

A help command with a bot description, list of commands, and important links.

![Help Command](https://i.imgur.com/zGf5ZVy.png)

### Test Command

A generic command, which can be copied to create additional commands.

![Test Command](https://i.imgur.com/eRwUPVJ.png)

### Info Command

An info command, which shows more detailed information about the bot.

![Info Command](https://i.imgur.com/pKJmdca.png)

## Setup

1. Copy example config files.
    - Navigate to the `config` folder of this project.
    - Copy all files ending in `.example.json` and remove the `.example` from the copied file names.
        - Ex: `config.example.json` should be copied and renamed as `config.json`.
2. Obtain a bot token.
    - You'll need to create a new bot in your [Discord Developer Portal](https://discordapp.com/developers/applications/).
        - See [here](https://www.writebots.com/discord-bot-token/) for detailed instructions.
        - At the end you should have a **bot token**.
3. Modify the config file.
    - Open the `config/config.json` file.
    - You'll need to edit the following values:
        - `client.token` - Your discord bot token.
4. Install packages.
    - Navigate into the downloaded source files and type `npm install`.

## Start Scripts

You can run the bot in 3 different modes:

1. Non-Shard Mode
    - Type `npm start`.
    - This runs the bot directly with Node and without shards.
    - Use this mode for general development.
2. Shard Mode
    - Type `npm run start:shard`.
    - This runs the bot directly with Node and with sharding enabled.
    - Use this mode if you are testing sharding.
3. PM2 Mode
    - Run by typing `npm run start:pm2`.
    - This runs the bot using the process manager [PM2](https://pm2.keymetrics.io/).
    - Use this mode if you require the bot to always be online.

## Bots Using This Template

A list of Discord bots using this template.

-   [Birthday Bot](https://top.gg/bot/656621136808902656) ![](https://top.gg/api/widget/servers/656621136808902656.svg?noavatar=true)
-   [Friend Time](https://top.gg/bot/471091072546766849) ![](https://top.gg/api/widget/servers/471091072546766849.svg?noavatar=true)
-   [QOTD Bot](https://top.gg/bot/713586207119900693) ![](https://top.gg/api/widget/servers/713586207119900693.svg?noavatar=true)

Don't see your bot listed? [Contact us](https://discord.gg/Vyf6fEWbVr) to have your bot added!

## References

-   [discord.js](https://discord.js.org/) - A powerful JavaScript library for interacting with the Discord API.
-   [Node Schedule](https://github.com/node-schedule/node-schedule) - A cron-like job scheduler for Node.
