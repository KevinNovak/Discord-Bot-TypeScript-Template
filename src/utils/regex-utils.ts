export class RegexUtils {
    public static discordId(input: string): string {
        return input.match(/\b\d{17,20}\b/)?.[0];
    }
}
