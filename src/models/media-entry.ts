import { MediaLanguage } from "./media-language";
import { Medium } from "./medium";

export interface MediaEntry {
    title: string,
    language: MediaLanguage,
    medium: Medium
}

export function mediaEntryId(entry: MediaEntry): string {
    return `${entry.medium}/${entry.title}/${entry.language}`;
}

export function mediaEntryFromId(id: string): MediaEntry {
    const [ medium, title, language ] = id.split("/");
    return {
        medium: medium as Medium,
        language: language as MediaLanguage,
        title
    };
}