export interface EventHandler {
    process(event: any): Promise<void>;
}
