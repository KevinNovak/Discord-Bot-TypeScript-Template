import { ChatInputCommandInteraction, MessageComponentInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import fetch from 'node-fetch';

import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';
import { TableBuilder } from '../../utils/table-builder.js';
import { log } from 'console';

const starMaxMineTime: Record<string, number> = {
    9: 90,
    8: 87,
7: 80,
6: 75,
5: 66,
4: 57,
3: 49,
2: 36,
1: 18
}

type Star = {
    region: string;
    time: number;
    world: number;
    tier: number;
    loc: string;
    scout: string;
}

type StarWithRemainingTime = Star & {
    timeRemaining: number
}

const getEstimatedTimeRemaining: (star: Star) => number = (star: Star) => {
    return starMaxMineTime[star.tier.toString()] - star.time;
}

export class StarCommand implements Command {
    public names = ['star'];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction): Promise<void> {
        const starData = await fetch('https://osrsportal.com/activestars', {
  'method': 'GET'
});

        if (starData.ok) {
            starData.json().then(async (data: Array<Star>) => {
                const formattedStars: Array<StarWithRemainingTime> = data.map(x => {
                    return{ ...x, timeRemaining: getEstimatedTimeRemaining(x) }
                })
                log(formattedStars)
                const stars = formattedStars.filter(x => (starMaxMineTime[x.tier.toString()] - 45)  > x.time)

                console.log('stars size: ', data.length)
                console.log('filtered size: ', stars.length)

                       const table = new TableBuilder<StarWithRemainingTime>(
                        [
      {
        width: 40,
        label: 'Location',
        index: 1,
        field: 'loc',
      },
      {
        width: 10,
        label: 'World',
        index: 2,
        field: 'world',
      },
      {
        width: 25,
        label: 'Est. Time Remaining',
        index: 3,
        field: 'timeRemaining',
      }
    ]
        )

                stars.sort((a, b) => getEstimatedTimeRemaining(b) - getEstimatedTimeRemaining(a)).slice(0, 8).forEach(star => table.addRows(star))
         
            console.log('lengt: ', table.build().length)


            await InteractionUtils.send(intr, table.build());
            })
        
        } else {
        await InteractionUtils.send(intr, 'error');
        }
    }
}
