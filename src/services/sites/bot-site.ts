export interface BotSite {
    name: string;
    enabled: boolean;
    updateServerCount(serverCount: number): Promise<void>;
}
