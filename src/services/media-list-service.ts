import { inject, injectable } from "tsyringe";
import { StorageProvider } from "../abstractions/storage-provider";
import { TOKENS } from "../abstractions/tokens";
import { CURRENT_MANIFEST_VERSION, MediaListManifest, MediaList } from "../models/media-list";
import { MediaEntry } from "../models/media-entry";

const EMPTY_LIST_MANIFEST: MediaListManifest = {
    entries: [],
    version: CURRENT_MANIFEST_VERSION
};

const STORAGE_KEY = "media-list";

@injectable()
export class MediaListService {
    public constructor(
        @inject(TOKENS.StorageProvider) private readonly storage: StorageProvider
    ) { }

    public async getList(): Promise<MediaList> {
        const manifest = (await this.storage.get<MediaListManifest>(STORAGE_KEY))
            ?? EMPTY_LIST_MANIFEST;

        return new MediaList(manifest);
    }

    public saveList(list: MediaList): Promise<void> {
        return this.storage.set(STORAGE_KEY, list.manifest());
    }

    public deleteList(): Promise<void> {
        return this.storage.set(STORAGE_KEY, EMPTY_LIST_MANIFEST);
    }
}
