import { NewsChannel, TextChannel, VoiceChannel, VoiceState } from 'discord.js';

import { EventDataService, Logger } from '../services/index.js';
import { ClientUtils, MessageUtils } from '../utils/index.js';

export class VoiceStateUpdateHandler {
    // This can be used for querying a database
    private eventDataService: EventDataService;
    private voiceChannelSuffix = '-time';

    constructor(eventDataService: EventDataService) {
        this.eventDataService = eventDataService;
    }

    public async process(oldState: VoiceState, newState: VoiceState): Promise<void> {
        let oldVoiceChannelId = oldState.channelId;
        let newVoiceChannelId = newState.channelId;

        Logger.info(`Voice state update: ${oldState.channelId} -> ${newVoiceChannelId}`);

        // This is a mute/unmute style event
        if (oldVoiceChannelId === newVoiceChannelId) {
            return;
        }
        // Leave event, since we know the new channel isn't equal
        // newChannel being null means they left and it being populated means they joined
        // a different voice channel
        if (oldVoiceChannelId !== null) {
            Logger.info(`User left voice channel: ${oldVoiceChannelId}`);
            return;
        }

        const guild = newState.guild;

        let voiceChannel = await ClientUtils.getChannel(guild.client, newVoiceChannelId);
        // If it's not type voice channel, return
        if (!(voiceChannel instanceof VoiceChannel)) {
            Logger.warn(`Channel ID ${newVoiceChannelId} is not a voice channel`);
            return;
        }

        const associatedTextChannel = await this.voiceChannelToTextChannel(voiceChannel);
        if (!associatedTextChannel) {
            Logger.warn(`No channel association found for channel ID ${newState.channelId}`);
            return;
        }
        await MessageUtils.send(
            associatedTextChannel,
            `${newState.member.user.username} has joined the voice channel.`
        );
    }

    private voiceChannelToTextChannel(
        voiceChannel: VoiceChannel
    ): Promise<TextChannel | NewsChannel> {
        const voiceChannelName = voiceChannel.name;
        const textChannelName = this.voiceChannelNameToTextChannelName(voiceChannelName);
        return ClientUtils.findTextChannel(voiceChannel.guild, textChannelName);
    }

    // Every voice channel has a text channel associated with it based on suffix
    // Ex. Voice Channel = game-time -> Text Channel = game
    // Remove the `voiceChannelSuffix` from the voice channel name to get the text channel name
    private voiceChannelNameToTextChannelName(voiceChannelName: string): string {
        return voiceChannelName.replace(this.voiceChannelSuffix, '');
    }
}
