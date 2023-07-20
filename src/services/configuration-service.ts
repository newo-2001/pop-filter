import { inject, injectable } from "tsyringe";
import { StorageProvider } from "../abstractions/storage-provider";
import { TOKENS } from "../abstractions/tokens";
import { Configuration } from "../configuration";

const STORAGE_KEY = "config";

const DEFAULT_CONFIGURATION: Configuration = {
    enableFiltering: true,
    enableLanguageFilter: true
}

@injectable()
export class ConfigurationService {
    public constructor(
        @inject(TOKENS.StorageProvider) private readonly storage: StorageProvider
    ) { }
    
    public async getConfiguration(): Promise<Configuration> {
        return (await this.storage.get(STORAGE_KEY)) ?? DEFAULT_CONFIGURATION;
    }

    public saveConfiguration(config: Configuration): Promise<void> {
        return this.storage.set(STORAGE_KEY, config);
    }
}