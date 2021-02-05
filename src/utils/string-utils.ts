import removeMarkdown from 'remove-markdown';

export class StringUtils {
    public static truncate(input: string, length: number, addEllipsis: boolean = false): string {
        if (input.length <= length) {
            return input;
        }

        let output = input.substr(0, addEllipsis ? length - 3 : length);
        if (addEllipsis) {
            output += '...';
        }

        return output;
    }

    public static stripMarkdown(input: string): string {
        return removeMarkdown(input);
    }
}
