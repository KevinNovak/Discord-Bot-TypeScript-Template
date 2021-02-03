import removeMarkdown from 'remove-markdown';

export class StringUtils {
    public static stripMarkdown(input: string): string {
        return removeMarkdown(input);
    }
}
