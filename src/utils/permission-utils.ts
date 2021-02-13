import { DMChannel, NewsChannel, Permissions, TextChannel } from 'discord.js-light';

export class PermissionUtils {
    public static canSend(channel: DMChannel | TextChannel | NewsChannel): boolean {
        // Bot always has permission in direct message
        if (channel instanceof DMChannel) {
            return true;
        }

        let channelPerms = channel.permissionsFor(channel.client.user);
        if (!channelPerms) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // SEND_MESSAGES - Needed to send messages
        return channelPerms.has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]);
    }

    public static canSendEmbed(channel: DMChannel | TextChannel | NewsChannel): boolean {
        // Bot always has permission in direct message
        if (channel instanceof DMChannel) {
            return true;
        }

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
    }

    public static canMention(channel: DMChannel | TextChannel | NewsChannel): boolean {
        // Bot always has permission in direct message
        if (channel instanceof DMChannel) {
            return true;
        }

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
    }

    public static canReact(
        channel: DMChannel | TextChannel | NewsChannel,
        removeOthers: boolean = false
    ): boolean {
        // Bot always has permission in direct message
        if (channel instanceof DMChannel) {
            return true;
        }

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
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Permissions.FLAGS.ADD_REACTIONS,
            ...(removeOthers ? [Permissions.FLAGS.MANAGE_MESSAGES] : []),
        ]);
    }

    public static canPin(
        channel: DMChannel | TextChannel | NewsChannel,
        unpinOld: boolean = false
    ): boolean {
        // Bot always has permission in direct message
        if (channel instanceof DMChannel) {
            return true;
        }

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
    }
}
