export interface Job {
    schedule: string;
    run(): Promise<void>;
    start(): void;
}
