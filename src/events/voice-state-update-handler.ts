import { NewsChannel, TextChannel, VoiceChannel, VoiceState } from 'discord.js';

import { EventDataService, Logger } from '../services/index.js';
import { ClientUtils } from '../utils/index.js';

export class VoiceStateUpdateHandler {
    private eventDataService: EventDataService;

    constructor(eventDataService: EventDataService) {
        this.eventDataService = eventDataService;
    }

    public async process(oldState: VoiceState, newState: VoiceState): Promise<void> {
        let newVoiceChannelId = newState.channelId;
        Logger.info(`Voice state update: ${oldState.channelId} -> ${newVoiceChannelId}`);
        // It will be null -> null on leaving (so return)
        // And null -> channel ID on joining
        if (oldState.channelId === newState.channelId) return;

        const guild = newState.guild;
        // const channels = await this.listChannels(guild);
        const channelAssocs: { [key: string]: string } = {
            'game-time': 'games',
            'riff-time': 'riffing',
            General: 'general',
        };

        let voiceChannel = await ClientUtils.getChannel(guild.client, newVoiceChannelId);
        // If it's not type voice channel, return
        if (!(voiceChannel instanceof VoiceChannel)) {
            return;
        }
        let associatedTextChannel: TextChannel | NewsChannel | null = null;

        for (const [key, value] of Object.entries(channelAssocs)) {
            if (voiceChannel.name.includes(key)) {
                associatedTextChannel = await ClientUtils.findTextChannel(guild, value);
                break;
            }
        }
        if (!associatedTextChannel) {
            console.log(`No channel association found for channel ID ${newState.channelId}`);
            return;
        }
        await associatedTextChannel.send(
            `${newState.member.user.username} has joined the voice channel.`
        );

        // if (voiceChannelId) {
        //     const channelName = channels[voiceChannelId];
        //     const chatChannelName = channelAssocs[channelName];
        //
        //     if (!chatChannelName) {
        //         console.log(`No channel association found for channel ID ${newState.channelId}`);
        //         return;
        //     }
        //
        //     const user = await guild.members.fetch(newState.id);
        //     const textChannel = guild.channels.cache.find(c => c.name === chatChannelName && c.type === 'GUILD_TEXT');
        //     textChannel?.send(`${user.user.username} has joined the voice channel.`);
        // }
    }
    //
    // private async listChannels(guild: any): Promise<{ [key: string]: string }> {
    //     const results: { [key: string]: string } = {};
    //     try {
    //         const channels = await guild.channels.fetch();
    //         channels.forEach((channel: any) => {
    //             if (channel.type === 'GUILD_VOICE') {
    //                 results[channel.id] = channel.name;
    //             }
    //         });
    //     } catch (err) {
    //         console.log('Error fetching guild channels:', err);
    //     }
    //     return results;
    // }
}
