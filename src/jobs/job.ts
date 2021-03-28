export interface Job {
    name: string;
    schedule: string;
    run(): Promise<void>;
}
