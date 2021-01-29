export class MathUtils {
    public static bytesToMB(bytes: number): number {
        return Math.round((bytes / 1024 / 1024) * 100) / 100;
    }
}
