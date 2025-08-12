# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot template written in TypeScript using discord.js v14. The bot supports slash commands, buttons, reactions, and triggers, with built-in sharding and clustering capabilities for scaling.

## Essential Commands

### Development & Build

```bash
npm install                   # Install dependencies
npm run build                 # Compile TypeScript to JavaScript (dist/)
npm run lint                  # Run ESLint checks
npm run lint:fix             # Auto-fix ESLint issues
npm run format               # Check Prettier formatting
npm run format:fix           # Auto-fix formatting issues
```

### Running the Bot

```bash
npm start                    # Start bot in normal mode (single instance)
npm run start:manager        # Start with shard manager (for scaling)
npm run start:pm2           # Start with PM2 process manager
```

### Discord Command Management

```bash
npm run commands:view        # View current commands
npm run commands:register    # Register slash commands with Discord
npm run commands:rename      # Rename commands
npm run commands:delete      # Delete specific commands
npm run commands:clear       # Clear all commands
```

### Testing

```bash
npm test                     # Run tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
```

## Architecture

### Core Entry Points

- `src/start-bot.ts` - Main bot entry, initializes client, commands, handlers, and jobs
- `src/start-manager.ts` - Sharding manager for running multiple bot instances

### Key Patterns

**Command Structure**: Commands are organized by type in `src/commands/`:

- Chat commands (`/chat/*`) - Regular slash commands
- Message commands - Right-click context menu on messages
- User commands - Right-click context menu on users

**Event-Driven Architecture**: All Discord events flow through specialized handlers in `src/events/`:

- `CommandHandler` - Processes slash commands
- `ButtonHandler` - Handles button interactions
- `MessageHandler` - Processes messages and triggers
- `ReactionHandler` - Handles reaction events
- `GuildJoinHandler/GuildLeaveHandler` - Server join/leave events

**Service Layer** (`src/services/`):

- Business logic separated from Discord API interactions
- Key services: `Logger`, `EventDataService`, `JobService`, `CommandRegistrationService`

**Extension Pattern**:

- `CustomClient` extends Discord.js Client with additional properties
- Located in `src/extensions/custom-client.ts`

### Configuration

All configuration files are in `config/` directory. Copy `.example.json` files and remove `.example`:

- `config.json` - Main bot configuration (token, intents, caching)
- `debug.json` - Debug settings and overrides
- `bot-sites.json` - Bot listing sites for posting stats

### Adding New Features

**New Command**:

1. Create command class in appropriate `src/commands/` subdirectory
2. Add metadata to corresponding metadata file
3. Register in `src/start-bot.ts` commands array
4. Run `npm run commands:register` to update Discord

**New Button/Reaction/Trigger**:

1. Create class in corresponding directory (`src/buttons/`, `src/reactions/`, `src/triggers/`)
2. Add to appropriate array in `src/start-bot.ts`

**New Job** (scheduled task):

1. Create job class extending `Job` in `src/jobs/`
2. Add to jobs array in `src/start-bot.ts` or `src/start-manager.ts`

### Scaling Considerations

- **Sharding**: Required when bot is in 2500+ servers, handled by `ShardingManager`
- **Clustering**: For multi-machine deployment, enabled in config with Master API
- **Rate Limiting**: Built-in command cooldowns and rate limiters
- **Caching**: Configurable cache limits in `config.json` to manage memory

### Language Support

Multi-language support via `lang/` directory:

- `lang.common.json` - Shared translations
- `lang.en-US.json`, `lang.en-GB.json` - Language-specific strings
- Access via `Lang` service in code

### Type Safety

TypeScript configuration in `tsconfig.json`:

- Target: ES2021
- Module: ES2022 (ESM)
- Strict mode is OFF (`"strict": false`)
- Decorators enabled for class-transformer/validator
