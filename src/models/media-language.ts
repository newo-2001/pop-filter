export enum MediaLanguage {
    English = "english",
    Japanese = "japanese"
}

export function flagForLanguage(language: MediaLanguage): string {
    switch (language) {
        case MediaLanguage.English:
            return "assets/flags/en.png"
        case MediaLanguage.Japanese:
            return "assets/flags/jp.png"
        default:
            throw new Error(`Couldn't load flag for language: ${language}`);
    }
}