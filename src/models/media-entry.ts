import { MediaLanguage } from "./media-language";
import { Medium } from "./medium";

export type MediaEntryData = {
    title: string,
    language: MediaLanguage,
    medium: Medium
}

export class MediaEntry {
    public title: string;
    public language: MediaLanguage;
    public medium: Medium;

    public constructor(data: MediaEntryData) {
        this.title = data.title;
        this.language = data.language;
        this.medium = data.medium;
    }

    public id = () => `${this.medium}/${this.title}/${this.language}`

    public static fromId(id: string): MediaEntry {
        const [ medium, title, language ] = id.split("/");
        
        return new MediaEntry({
            title,
            language: language as MediaLanguage,
            medium: medium as Medium
        });
    }

    public data = () => ({
        title: this.title,
        language: this.language,
        medium: this.medium
    })
}