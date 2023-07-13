import { MediaEntry } from "./media-entry";

const STORAGE_KEY = "media-list";
const CURRENT_VERSION = 2;

interface MediaListManifest {
    version: number,
    entries: MediaEntry[]
}

export class MediaList {
    private entries: Set<MediaEntry>;

    constructor(
        entries: MediaEntry[] = [],
        private version: number = CURRENT_VERSION
    ) {
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
        const manifest = this.createManifest();
        return chrome.storage.sync.set({ [STORAGE_KEY]: manifest });
    }

    public static async fromStorage(): Promise<MediaList> {
        const manifest = (await chrome.storage.sync.get(null))[STORAGE_KEY]
            ?? { entries: [], version: CURRENT_VERSION } as MediaListManifest;

        return MediaList.fromManifest(manifest);
    }

    public serializeJson(): string {
        return JSON.stringify(this.createManifest());
    }

    public static deserializeJson(json: string): MediaList {
        const manifest = JSON.parse(json) as MediaListManifest;
        return this.fromManifest(manifest);
    }

    public getVersion(): number {
        return this.version;
    }

    private createManifest(): MediaListManifest {
        return {
            entries: Array.from(this.entries),
            version: this.version
        };
    }

    private static fromManifest(manifest: MediaListManifest): MediaList {
        return new MediaList(manifest.entries, manifest.version);
    }
}