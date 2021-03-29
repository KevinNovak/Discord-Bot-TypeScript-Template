export interface Job {
    name: string;
    log: boolean;
    schedule: string;
    run(): Promise<void>;
}
