import { Locale, PermissionsString } from 'discord.js';

import { Lang } from '../../services/index.js';

interface PermissionData {
    displayName(langCode: Locale): string;
}

export class Permission {
    public static Data: {
        [key in PermissionsString]: PermissionData;
    } = {
        AddReactions: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.AddReactions', langCode);
            },
        },
        Administrator: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.Administrator', langCode);
            },
        },
        AttachFiles: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.AttachFiles', langCode);
            },
        },
        BanMembers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.BanMembers', langCode);
            },
        },
        ChangeNickname: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ChangeNickname', langCode);
            },
        },
        Connect: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.Connect', langCode);
            },
        },
        CreateInstantInvite: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CreateInstantInvite', langCode);
            },
        },
        CreatePrivateThreads: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CreatePrivateThreads', langCode);
            },
        },
        CreatePublicThreads: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.CreatePublicThreads', langCode);
            },
        },
        DeafenMembers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.DeafenMembers', langCode);
            },
        },
        EmbedLinks: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.EmbedLinks', langCode);
            },
        },
        KickMembers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.KickMembers', langCode);
            },
        },
        ManageChannels: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageChannels', langCode);
            },
        },
        ManageEmojisAndStickers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageEmojisAndStickers', langCode);
            },
        },
        ManageEvents: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageEvents', langCode);
            },
        },
        ManageGuild: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageGuild', langCode);
            },
        },
        ManageGuildExpressions: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageGuildExpressions', langCode);
            },
        },
        ManageMessages: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageMessages', langCode);
            },
        },
        ManageNicknames: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageNicknames', langCode);
            },
        },
        ManageRoles: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageRoles', langCode);
            },
        },
        ManageThreads: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageThreads', langCode);
            },
        },
        ManageWebhooks: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ManageWebhooks', langCode);
            },
        },
        MentionEveryone: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MentionEveryone', langCode);
            },
        },
        ModerateMembers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ModerateMembers', langCode);
            },
        },
        MoveMembers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MoveMembers', langCode);
            },
        },
        MuteMembers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.MuteMembers', langCode);
            },
        },
        PrioritySpeaker: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.PrioritySpeaker', langCode);
            },
        },
        ReadMessageHistory: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ReadMessageHistory', langCode);
            },
        },
        RequestToSpeak: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.RequestToSpeak', langCode);
            },
        },
        SendMessages: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SendMessages', langCode);
            },
        },
        SendMessagesInThreads: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SendMessagesInThreads', langCode);
            },
        },
        SendTTSMessages: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SendTTSMessages', langCode);
            },
        },
        SendVoiceMessages: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.SendVoiceMessages', langCode);
            },
        },
        Speak: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.Speak', langCode);
            },
        },
        Stream: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.Stream', langCode);
            },
        },
        UseApplicationCommands: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseApplicationCommands', langCode);
            },
        },
        UseEmbeddedActivities: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseEmbeddedActivities', langCode);
            },
        },
        UseExternalEmojis: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseExternalEmojis', langCode);
            },
        },
        UseExternalSounds: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseExternalSounds', langCode);
            },
        },
        UseExternalStickers: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseExternalStickers', langCode);
            },
        },
        UseSoundboard: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseSoundboard', langCode);
            },
        },
        UseVAD: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.UseVAD', langCode);
            },
        },
        ViewAuditLog: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ViewAuditLog', langCode);
            },
        },
        ViewChannel: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ViewChannel', langCode);
            },
        },
        ViewCreatorMonetizationAnalytics: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ViewCreatorMonetizationAnalytics', langCode);
            },
        },
        ViewGuildInsights: {
            displayName(langCode: Locale): string {
                return Lang.getRef('permissions.ViewGuildInsights', langCode);
            },
        },
    };
}
