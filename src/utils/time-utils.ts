import { Duration } from 'luxon'; // TODO: Missing types

export class TimeUtils {
    public static friendlyDuration(milliseconds: number): string {
        return Duration.fromObject(
            Object.fromEntries(
                Object.entries(
                    Duration.fromMillis(milliseconds)
                        .shiftTo(
                            'year',
                            'quarter',
                            'month',
                            'week',
                            'day',
                            'hour',
                            'minute',
                            'second'
                        )
                        .toObject()
                ).filter(([_, value]) => !!value)
            )
        ).toHuman(); // TODO: Add language
    }
}
