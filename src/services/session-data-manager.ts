export class SessionDataManager {
    private static sessions = new Map<string, Record<string, any>>();
    
    // TTL in milliseconds (5 minutes by default)
    private static SESSION_TTL = 5 * 60 * 1000;
    
    public static setData(userId: string, key: string, value: any): void {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, {});
            
            // Auto-expire session after TTL
            setTimeout(() => {
                this.sessions.delete(userId);
            }, this.SESSION_TTL);
        }
        
        const userData = this.sessions.get(userId);
        userData[key] = value;
    }
    
    public static getData(userId: string, key: string): any {
        if (!this.sessions.has(userId)) return null;
        return this.sessions.get(userId)?.[key] ?? null;
    }
    
    public static getAllData(userId: string): Record<string, any> | null {
        return this.sessions.get(userId) || null;
    }
    
    public static clearData(userId: string): void {
        this.sessions.delete(userId);
    }

    public static hasSession(userId: string): boolean {
        return this.sessions.has(userId);
    }
}