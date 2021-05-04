# Discord Bot TypeScript Template

[![discord.js-light](https://img.shields.io/github/package-json/dependency-version/KevinNovak/Discord-Bot-TypeScript-Template/discord.js-light)](https://github.com/timotejroiko/discord.js-light)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

**Discord bot** - A discord.js bot template written with TypeScript.

## Introduction

This template was created to give developers a starting point for new Discord bots, so that much of the initial setup can be avoided and developers can instead focus on meaningful bot features. Developers can simply copy this repo, follow the [setup instructions](#setup) below, and have a working bot with many [boilerplate features](#features) already included!

For help using this template, feel free to [join our support server](https://discord.gg/Vyf6fEWbVr)!

## Features

### Built-In Bot Features:

-   Basic command structure.
-   Rate limits for commands.
-   Welcome message when joining a server.
-   Shows server count in bot status.
-   Posts server count to popular bot list websites.
-   Support for multiple languages.

### Developer Friendly:

-   Written with TypeScript.
-   Uses the [discord.js-light](https://github.com/timotejroiko/discord.js-light) framework.
    -   Based on [discord.js](https://discord.js.org/), but more memory efficient.
-   Built-in debugging setup for VSCode.
-   Support for running with the [PM2](https://pm2.keymetrics.io/) process manger.
-   Support for running with [Docker](https://www.docker.com/).

### Scales as Your Bot Grows:

-   Supports [sharding](https://discordjs.guide/sharding/) which is required when your bot is in 2500+ servers.
-   Supports [clustering](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template-Master-Api) which allows you to run your bot on multiple machines.

## Commands

This bot has a few example commands which can be modified as needed.

### Help Command

A help command with a bot description, list of commands, and important links.

![Help Command](https://i.imgur.com/N7LfacD.png)

### Test Command

A generic command, which can be copied to create additional commands.

![Test Command](https://i.imgur.com/bYKEizS.png)

### Info Command

An info command, which shows more information and relevant links.

![Info Command](https://i.imgur.com/wIlKnBD.png)

### Dev Command

A dev command, which shows detailed information that may be helpful to developers.

![Dev Command](https://i.imgur.com/PKiur9p.png)

### Misc Commands

There are additional commands built-in that simply provide relevant links (`invite`, `docs`, `support`, `vote`).

![Misc Commands](https://i.imgur.com/Q2aYa5U.png)

### Welcome Message

A welcome message is sent to the server and owner when the bot is added.

![Welcome Message](https://i.imgur.com/00mXi0O.png)

## Setup

1. Copy example config files.
    - Navigate to the `config` folder of this project.
    - Copy all files ending in `.example.json` and remove the `.example` from the copied file names.
        - Ex: `config.example.json` should be copied and renamed as `config.json`.
2. Obtain a bot token.
    - You'll need to create a new bot in your [Discord Developer Portal](https://discord.com/developers/applications/).
        - See [here](https://www.writebots.com/discord-bot-token/) for detailed instructions.
        - At the end you should have a **bot token**.
3. Modify the config file.
    - Open the `config/config.json` file.
    - You'll need to edit the following values:
        - `client.token` - Your discord bot token.
4. Install packages.
    - Navigate into the downloaded source files and type `npm install`.

## Start Scripts

You can run the bot in 4 different modes:

1. Dev Mode
    - Type `npm start:dev`.
    - This runs the bot with [ts-node-dev](https://www.npmjs.com/package/ts-node-dev).
    - Use this mode for general development.
    - TypeScript files are compiled automatically as they are changed.
2. Normal Mode
    - Type `npm start`.
    - This runs the bot directly with Node and without shards.
    - Use this mode if you don't need sharding.
3. Shard Mode
    - Type `npm run start:shard`.
    - This runs the bot directly with Node and with sharding enabled.
    - Use this mode if you need sharding.
4. PM2 Mode
    - Run by typing `npm run start:pm2`.
    - This runs the bot using the process manager [PM2](https://pm2.keymetrics.io/).
    - Use this mode if you require the bot to always be online.

## Bots Using This Template

A list of Discord bots using this template.

| Bot                                                   | Servers                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| [Birthday Bot](https://top.gg/bot/656621136808902656) | ![](https://top.gg/api/widget/servers/656621136808902656.svg) |
| [Friend Time](https://top.gg/bot/471091072546766849)  | ![](https://top.gg/api/widget/servers/471091072546766849.svg) |
| [QOTD Bot](https://top.gg/bot/713586207119900693)     | ![](https://top.gg/api/widget/servers/713586207119900693.svg) |

Don't see your bot listed? [Contact us](https://discord.gg/Vyf6fEWbVr) to have your bot added!
