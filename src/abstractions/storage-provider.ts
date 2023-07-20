export interface StorageProvider {
    clear(): Promise<void>
    set(key: string, value: any): Promise<void>
    get<T>(key: string): Promise<T | undefined>
    getAll<T>(): Promise<T>
}