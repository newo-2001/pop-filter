import { MediaLanguage } from "./media-language";
import { Medium } from "./medium";

export interface MediaEntry {
    title: string,
    language: MediaLanguage,
    medium: Medium
}