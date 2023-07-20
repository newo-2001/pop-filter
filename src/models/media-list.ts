import { MediaEntry, MediaEntryData } from "./media-entry";

export const CURRENT_MANIFEST_VERSION = 2;

export interface MediaListManifest {
    version: number,
    entries: MediaEntryData[]
}

export class MediaList {
    public readonly manifestVersion: number;
    private readonly _entries: Set<string>;

    public constructor(manifest: MediaListManifest) {
        this.manifestVersion = manifest.version;
        this._entries = new Set(
            manifest.entries.map(entry => new MediaEntry(entry).id())
        );
    }

    public add(entry: MediaEntry): void {
        this._entries.add(entry.id());
    }

    public remove(entry: MediaEntry): void {
        this._entries.delete(entry.id());
    }

    public contains(entry: MediaEntry): boolean {
        return this._entries.has(entry.id());
    }

    public clear(): void {
        this._entries.clear();
    }

    public cardinality(): number {
        return this._entries.size;
    }

    public entries(): MediaEntry[] {
        return Array.from(this._entries)
            .map(MediaEntry.fromId);
    }

    public manifest(): MediaListManifest {
        return {
            entries: this.entries().map(entry => entry.data()),
            version: this.manifestVersion
        };
    }
}