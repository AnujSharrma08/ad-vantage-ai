interface UsageStats {
    totalCharacters: number;
    totalCost: number;
    charactersToday: number;
    lastReset: string;
}

const COST_PER_MILLION = 20; // $20 per million characters
const FREE_CREDITS = 300; // $300 free credit

export class UsageTracker {
    private static STORAGE_KEY = 'translation_usage';

    static getUsage(): UsageStats {
        if (typeof window === 'undefined') {
            return {
                totalCharacters: 0,
                totalCost: 0,
                charactersToday: 0,
                lastReset: new Date().toISOString(),
            };
        }

        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            return this.initializeUsage();
        }

        const usage: UsageStats = JSON.parse(stored);

        // Reset daily counter if it's a new day
        const lastReset = new Date(usage.lastReset);
        const today = new Date();

        if (lastReset.toDateString() !== today.toDateString()) {
            usage.charactersToday = 0;
            usage.lastReset = today.toISOString();
            this.saveUsage(usage);
        }

        return usage;
    }

    static trackTranslation(text: string): void {
        if (typeof window === 'undefined') return;

        const usage = this.getUsage();
        const characterCount = text.length;

        usage.totalCharacters += characterCount;
        usage.charactersToday += characterCount;
        usage.totalCost = (usage.totalCharacters / 1_000_000) * COST_PER_MILLION;

        this.saveUsage(usage);
    }

    static getRemainingCredits(): number {
        const usage = this.getUsage();
        return Math.max(0, FREE_CREDITS - usage.totalCost);
    }

    static getUsagePercentage(): number {
        const usage = this.getUsage();
        return Math.min(100, (usage.totalCost / FREE_CREDITS) * 100);
    }

    static resetUsage(): void {
        this.saveUsage(this.initializeUsage());
    }

    private static initializeUsage(): UsageStats {
        return {
            totalCharacters: 0,
            totalCost: 0,
            charactersToday: 0,
            lastReset: new Date().toISOString(),
        };
    }

    private static saveUsage(usage: UsageStats): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
    }

    static formatCost(cost: number): string {
        return `$${cost.toFixed(2)}`;
    }

    static formatCharacters(chars: number): string {
        if (chars >= 1_000_000) {
            return `${(chars / 1_000_000).toFixed(2)}M`;
        } else if (chars >= 1_000) {
            return `${(chars / 1_000).toFixed(1)}K`;
        }
        return chars.toString();
    }
}