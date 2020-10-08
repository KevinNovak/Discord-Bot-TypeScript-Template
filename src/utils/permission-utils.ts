import { Permissions, TextChannel } from 'discord.js';

export abstract class PermissionUtils {
    public static canSend(channel: TextChannel): boolean {
        let channelPerms = channel.permissionsFor(channel.client.user);
        if (!channelPerms) {
            // This can happen if the guild disconnected while a collector is running
            return false;
        }

        // VIEW_CHANNEL - Needed to view the channel
        // SEND_MESSAGES - Needed to send messages
        return channelPerms.has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]);
    }

    public static canSendEmbed(channel: TextChannel): boolean {
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
}
