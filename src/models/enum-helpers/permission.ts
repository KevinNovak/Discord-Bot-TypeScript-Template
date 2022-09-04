import { Locale } from 'discord-api-types/v10';
import { PermissionString } from 'discord.js';

import { Lang } from '../../services/index.js';

interface PermissionData {
    displayName(langCode: Locale): string;
}

export class Permission {
    public static Data: {
        [key in PermissionString]: PermissionData;
    } = {
        ADD_REACTIONS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ADD_REACTIONS', langCode);
            },
        },
        ADMINISTRATOR: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ADMINISTRATOR', langCode);
            },
        },
        ATTACH_FILES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ATTACH_FILES', langCode);
            },
        },
        BAN_MEMBERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.BAN_MEMBERS', langCode);
            },
        },
        CHANGE_NICKNAME: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CHANGE_NICKNAME', langCode);
            },
        },
        CONNECT: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CONNECT', langCode);
            },
        },
        CREATE_INSTANT_INVITE: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CREATE_INSTANT_INVITE', langCode);
            },
        },
        CREATE_PRIVATE_THREADS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CREATE_PRIVATE_THREADS', langCode);
            },
        },
        CREATE_PUBLIC_THREADS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CREATE_PUBLIC_THREADS', langCode);
            },
        },
        DEAFEN_MEMBERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.DEAFEN_MEMBERS', langCode);
            },
        },
        EMBED_LINKS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.EMBED_LINKS', langCode);
            },
        },
        KICK_MEMBERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.KICK_MEMBERS', langCode);
            },
        },
        MANAGE_CHANNELS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_CHANNELS', langCode);
            },
        },
        MANAGE_EMOJIS_AND_STICKERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_EMOJIS_AND_STICKERS', langCode);
            },
        },
        MANAGE_EVENTS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_EVENTS', langCode);
            },
        },
        MANAGE_GUILD: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_GUILD', langCode);
            },
        },
        MANAGE_MESSAGES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_MESSAGES', langCode);
            },
        },
        MANAGE_NICKNAMES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_NICKNAMES', langCode);
            },
        },
        MANAGE_ROLES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_ROLES', langCode);
            },
        },
        MANAGE_THREADS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_THREADS', langCode);
            },
        },
        MANAGE_WEBHOOKS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MANAGE_WEBHOOKS', langCode);
            },
        },
        MENTION_EVERYONE: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MENTION_EVERYONE', langCode);
            },
        },
        MODERATE_MEMBERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MODERATE_MEMBERS', langCode);
            },
        },
        MOVE_MEMBERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MOVE_MEMBERS', langCode);
            },
        },
        MUTE_MEMBERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MUTE_MEMBERS', langCode);
            },
        },
        PRIORITY_SPEAKER: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.PRIORITY_SPEAKER', langCode);
            },
        },
        READ_MESSAGE_HISTORY: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.READ_MESSAGE_HISTORY', langCode);
            },
        },
        REQUEST_TO_SPEAK: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.REQUEST_TO_SPEAK', langCode);
            },
        },
        SEND_MESSAGES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SEND_MESSAGES', langCode);
            },
        },
        SEND_MESSAGES_IN_THREADS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SEND_MESSAGES_IN_THREADS', langCode);
            },
        },
        SEND_TTS_MESSAGES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SEND_TTS_MESSAGES', langCode);
            },
        },
        SPEAK: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SPEAK', langCode);
            },
        },
        START_EMBEDDED_ACTIVITIES: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.START_EMBEDDED_ACTIVITIES', langCode);
            },
        },
        STREAM: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.STREAM', langCode);
            },
        },
        USE_APPLICATION_COMMANDS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.USE_APPLICATION_COMMANDS', langCode);
            },
        },
        USE_EXTERNAL_EMOJIS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.USE_EXTERNAL_EMOJIS', langCode);
            },
        },
        USE_EXTERNAL_STICKERS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.USE_EXTERNAL_STICKERS', langCode);
            },
        },
        USE_PRIVATE_THREADS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.USE_PRIVATE_THREADS', langCode);
            },
        },
        USE_PUBLIC_THREADS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.USE_PUBLIC_THREADS', langCode);
            },
        },
        USE_VAD: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.USE_VAD', langCode);
            },
        },
        VIEW_AUDIT_LOG: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.VIEW_AUDIT_LOG', langCode);
            },
        },
        VIEW_CHANNEL: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.VIEW_CHANNEL', langCode);
            },
        },
        VIEW_GUILD_INSIGHTS: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.VIEW_GUILD_INSIGHTS', langCode);
            },
        },
    };
}
