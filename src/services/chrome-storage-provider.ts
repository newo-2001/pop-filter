import { injectable } from "tsyringe";
import { StorageProvider } from "../abstractions/storage-provider";

@injectable()
export class ChromeStorageProvider implements StorageProvider {
    public clear(): Promise<void> {
        return chrome.storage.local.clear();
    }

    public set(key: string, value: any): Promise<void> {
        return chrome.storage.local.set({ [key]: value });
    }
    
    public async get<T>(key: string): Promise<T | undefined> {
        return (await chrome.storage.local.get(key))[key] as T | undefined;
    }

    public async getAll<T>(): Promise<T> {
        return (await chrome.storage.local.get(null)) as T;
    }
}