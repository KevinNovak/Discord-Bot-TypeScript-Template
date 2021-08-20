import {
    DMChannel,
    NewsChannel,
    Permissions,
    TextBasedChannels,
    TextChannel,
    ThreadChannel,
} from 'discord.js';

export class PermissionUtils {
    public static canSend(channel: TextBasedChannels): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (
            channel instanceof TextChannel ||
            channel instanceof NewsChannel ||
            channel instanceof ThreadChannel
        ) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }

            // VIEW_CHANNEL - Needed to view the channel
            // SEND_MESSAGES - Needed to send messages
            return channelPerms.has([
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
            ]);
        } else {
            return false;
        }
    }

    public static canSendEmbed(channel: TextBasedChannels): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (
            channel instanceof TextChannel ||
            channel instanceof NewsChannel ||
            channel instanceof ThreadChannel
        ) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }

            // VIEW_CHANNEL - Needed to view the channel
            // SEND_MESSAGES - Needed to send messages
            // EMBED_LINKS - Needed to send embedded links
            return channelPerms.has([
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
            ]);
        } else {
            return false;
        }
    }

    public static canMention(channel: TextBasedChannels): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (
            channel instanceof TextChannel ||
            channel instanceof NewsChannel ||
            channel instanceof ThreadChannel
        ) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }

            // VIEW_CHANNEL - Needed to view the channel
            // MENTION_EVERYONE - Needed to mention @everyone, @here, and all roles
            return channelPerms.has([
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.MENTION_EVERYONE,
            ]);
        } else {
            return false;
        }
    }

    public static canReact(channel: TextBasedChannels, removeOthers: boolean = false): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (
            channel instanceof TextChannel ||
            channel instanceof NewsChannel ||
            channel instanceof ThreadChannel
        ) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }

            // VIEW_CHANNEL - Needed to view the channel
            // ADD_REACTIONS - Needed to add new reactions to messages
            // READ_MESSAGE_HISTORY - Needed to add new reactions to messages
            //    https://discordjs.guide/popular-topics/permissions-extended.html#implicit-permissions
            // MANAGE_MESSAGES - Needed to remove others reactions
            return channelPerms.has([
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.ADD_REACTIONS,
                Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ...(removeOthers ? [Permissions.FLAGS.MANAGE_MESSAGES] : []),
            ]);
        } else {
            return false;
        }
    }

    public static canPin(channel: TextBasedChannels, unpinOld: boolean = false): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (
            channel instanceof TextChannel ||
            channel instanceof NewsChannel ||
            channel instanceof ThreadChannel
        ) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                // This can happen if the guild disconnected while a collector is running
                return false;
            }

            // VIEW_CHANNEL - Needed to view the channel
            // MANAGE_MESSAGES - Needed to pin messages
            // READ_MESSAGE_HISTORY - Needed to find old pins to unpin
            return channelPerms.has([
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.MANAGE_MESSAGES,
                ...(unpinOld ? [Permissions.FLAGS.READ_MESSAGE_HISTORY] : []),
            ]);
        } else {
            return false;
        }
    }
}
