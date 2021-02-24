export class RegexUtils {
    public static regex(input: string): RegExp {
        let match = /^\/(.*)\/([^\/]*)$/.exec(input);
        if (!match) {
            return;
        }

        return new RegExp(match[1], match[2]);
    }

    public static discordId(input: string): string {
        return input.match(/\b\d{17,20}\b/)?.[0];
    }
}
