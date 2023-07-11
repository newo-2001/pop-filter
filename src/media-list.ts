export type MediaEntry = string;

const STORAGE_KEY = "media-list";

export class MediaList {
    private entries: Set<MediaEntry>;

    constructor(entries: MediaEntry[] = []) {
        this.entries = new Set(entries);
    }

    public add(entry: MediaEntry): void {
        this.entries.add(entry);
    }

    public remove(entry: MediaEntry): void {
        this.entries.delete(entry);
    }

    public contains(entry: MediaEntry): boolean {
        return this.entries.has(entry);
    }

    public saveToStorage(): Promise<void> {
        return chrome.storage.sync.set({ [STORAGE_KEY]: Array.from(this.entries) });
    }

    public static async fromStorage(): Promise<MediaList> {
        const entries = (await chrome.storage.sync.get(null))[STORAGE_KEY] ?? [] as string[];
        return new MediaList(entries);
    }
    
    public asJson(): string {
        return JSON.stringify(Array.from(this.entries));
    }

    public static fromJson(json: string): MediaList {
        const entries = JSON.parse(json);
        return new MediaList(entries);
    }
}