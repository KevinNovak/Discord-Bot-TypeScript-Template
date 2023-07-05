# Discord Bot TypeScript Template

[![discord.js](https://img.shields.io/github/package-json/dependency-version/KevinNovak/Discord-Bot-TypeScript-Template/discord.js)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/KevinNovak/Discord-Bot-TypeScript-Template.svg)](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template/stargazers)
[![Pull Requests](https://img.shields.io/badge/Pull%20Requests-Welcome!-brightgreen)](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template/pulls)

**Discord bot** - A discord.js bot template written with TypeScript.

## Introduction

This template was created to give developers a starting point for new Discord bots, so that much of the initial setup can be avoided and developers can instead focus on meaningful bot features. Developers can simply copy this repo, follow the [setup instructions](#setup) below, and have a working bot with many [boilerplate features](#features) already included!

For help using this template, feel free to [join our support server](https://discord.gg/c9kQktCbsE)!

[![Discord Shield](https://discord.com/api/guilds/660711235766976553/widget.png?style=shield)](https://discord.gg/c9kQktCbsE)

## Features

### Built-In Bot Features:

-   Basic command structure.
-   Rate limits and command cooldowns.
-   Welcome message when joining a server.
-   Shows server count in bot status.
-   Posts server count to popular bot list websites.
-   Support for multiple languages.

### Developer Friendly:

-   Written with TypeScript.
-   Uses the [discord.js](https://discord.js.org/) framework.
-   Built-in debugging setup for VSCode.
-   Written with [ESM](https://nodejs.org/api/esm.html#introduction) for future compatibility with packages.
-   Support for running with the [PM2](https://pm2.keymetrics.io/) process manger.
-   Support for running with [Docker](https://www.docker.com/).

### Scales as Your Bot Grows:

-   Supports [sharding](https://discordjs.guide/sharding/) which is required when your bot is in 2500+ servers.
-   Supports [clustering](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template-Master-Api) which allows you to run your bot on multiple machines.

## Commands

This bot has a few example commands which can be modified as needed.

### Help Command

A `/help` command to get help on different areas of the bot or to contact support:

![](https://i.imgur.com/UUA4WzL.png)

![](https://i.imgur.com/YtDdmTe.png)

![](https://i.imgur.com/JXMisap.png)

### Info Command

A `/info` command to get information about the bot or links to different resources.

![](https://i.imgur.com/0kKOaWM.png)

### Test Command

A generic command, `/test`, which can be copied to create additional commands.

![](https://i.imgur.com/lqjkNKM.png)

### Dev Command

A `/dev` command which can only be run by the bot developer. Shows developer information, but can be extended to perform developer-only actions.

![](https://i.imgur.com/2o1vEno.png)

### Welcome Message

A welcome message is sent to the server and owner when the bot is added.

![](https://i.imgur.com/QBw8H8v.png)

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
        - `client.id` - Your discord bot's [user ID](https://techswift.org/2020/04/22/how-to-find-your-user-id-on-discord/).
        - `client.token` - Your discord bot's token.
4. Install packages.
    - Navigate into the downloaded source files and type `npm install`.
5. Register commands.
    - In order to use slash commands, they first [have to be registered](https://discordjs.guide/creating-your-bot/command-deployment.html).
    - Type `npm run commands:register` to register the bot's commands.
        - Run this script any time you change a command name, structure, or add/remove commands.
        - This is so Discord knows what your commands look like.
        - It may take up to an hour for command changes to appear.

## Start Scripts

You can run the bot in multiple modes:

1. Normal Mode
    - Type `npm start`.
    - Starts a single instance of the bot.
2. Manager Mode
    - Type `npm run start:manager`.
    - Starts a shard manager which will spawn multiple bot shards.
3. PM2 Mode
    - Type `npm run start:pm2`.
    - Similar to Manager Mode but uses [PM2](https://pm2.keymetrics.io/) to manage processes.

## Bots Using This Template

A list of Discord bots using this template.

| Bot                                                                    | Servers                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Birthday Bot](https://top.gg/bot/656621136808902656)                  | ![](https://top.gg/api/widget/servers/656621136808902656.svg) |
| [QOTD Bot](https://top.gg/bot/713586207119900693)                      | ![](https://top.gg/api/widget/servers/713586207119900693.svg) |
| [Friend Time](https://top.gg/bot/471091072546766849)                   | ![](https://top.gg/api/widget/servers/471091072546766849.svg) |
| [Bento](https://top.gg/bot/787041583580184609)                         | ![](https://top.gg/api/widget/servers/787041583580184609.svg) |
| [NFT-Info](https://top.gg/bot/902249456072818708)                      | ![](https://top.gg/api/widget/servers/902249456072818708.svg) |
| [Skylink-IF](https://top.gg/bot/929527099922993162)                    | ![](https://top.gg/api/widget/servers/929527099922993162.svg) |
| [Topcoder TC-101](https://github.com/topcoder-platform/tc-discord-bot) |                                                               |

Don't see your bot listed? [Contact us](https://discord.gg/c9kQktCbsE) to have your bot added!
