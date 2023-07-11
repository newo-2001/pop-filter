export interface Configuration {
    enableFiltering: boolean
}

const CONFIG_KEY = "config";
const defaultConfig: Configuration = {
    enableFiltering: true
}

export function saveConfiguration(config: Configuration): Promise<void> {
    return chrome.storage.sync.set({ [CONFIG_KEY]: config });
}

export async function loadConfiguration(): Promise<Configuration> {
    return (await chrome.storage.sync.get(null))[CONFIG_KEY]
        ?? defaultConfig as Configuration;
}
