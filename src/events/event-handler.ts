export interface EventHandler {
    process(...args: any[]): Promise<void>;
}
