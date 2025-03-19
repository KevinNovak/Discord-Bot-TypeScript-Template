export class StringUtils {
    public static truncate(input: string, length: number, addEllipsis: boolean = false): string {
        if (input.length <= length) {
            return input;
        }

        let output = input.substring(0, addEllipsis ? length - 3 : length);
        if (addEllipsis) {
            output += '...';
        }

        return output;
    }
}
