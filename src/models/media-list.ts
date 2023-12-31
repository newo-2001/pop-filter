import { MediaEntry, mediaEntryFromId, mediaEntryId } from "./media-entry";

const STORAGE_KEY = "media-list";
const CURRENT_VERSION = 2;

const EMPTY_LIST_MANIFEST: MediaListManifest = {
    entries: [],
    version: CURRENT_VERSION
};

interface MediaListManifest {
    version: number,
    entries: MediaEntry[]
}

export class MediaList {
    private entries: Set<string>;

    constructor(
        entries: MediaEntry[] = [],
        private version: number = CURRENT_VERSION
    ) {
        this.entries = new Set(entries.map(entry => mediaEntryId(entry)));
    }

    public add(entry: MediaEntry): void {
        this.entries.add(mediaEntryId(entry));
    }

    public remove(entry: MediaEntry): void {
        this.entries.delete(mediaEntryId(entry));
    }

    public contains(entry: MediaEntry): boolean {
        return this.entries.has(mediaEntryId(entry));
    }

    public saveToStorage(): Promise<void> {
        const manifest = this.createManifest();
        return chrome.storage.local.set({ [STORAGE_KEY]: manifest });
    }

    public static async fromStorage(): Promise<MediaList> {
        const manifest = (await chrome.storage.local.get(null))[STORAGE_KEY]
            ?? EMPTY_LIST_MANIFEST as MediaListManifest;

        return MediaList.fromManifest(manifest);
    }

    public serializeJson(): string {
        return JSON.stringify(this.createManifest());
    }

    public static deserializeJson(json: string): MediaList {
        const manifest = JSON.parse(json) as MediaListManifest;
        return this.fromManifest(manifest);
    }

    public static clearStorage(): Promise<void> {
        return chrome.storage.local.set({ [STORAGE_KEY]: EMPTY_LIST_MANIFEST });
    }

    public getVersion(): number {
        return this.version;
    }

    public cardinality(): number {
        return this.entries.size;
    }

    private createManifest(): MediaListManifest {
        return {
            entries: Array.from(this.entries).map(mediaEntryFromId),
            version: this.version
        };
    }

    private static fromManifest(manifest: MediaListManifest): MediaList {
        return new MediaList(manifest.entries, manifest.version);
    }
}