import { ApplicationState } from "../models/application-state";
import { MediaEntry } from "../models/media-entry";
import { MediaLanguage } from "../models/media-language";
import { MEDIA_URL_NAMES, Medium } from "../models/medium";

interface MediaInfo {
    medium: Medium,
    title: string
}

const VALID_MEDIA = [
    Medium.TVShow,
    Medium.Movie,
    Medium.VideoGame
];

export function injectMediaButons(state: ApplicationState): Promise<boolean> {
    const mediaInfo = parseUrl(state.url);
    if (!mediaInfo || !VALID_MEDIA.includes(mediaInfo.medium)) {
        return Promise.resolve(false);
    }

    const header = document.getElementById("medium_heading");
    if (!header) {
        return Promise.reject(new Error("Missing medium_heading element on media page"));
    }

    for (const language of getVoiceLanguages()) {
        const entry: MediaEntry = {
            ...mediaInfo,
            language
        };

        createButton(entry, state);
    }

    return Promise.resolve(true);
}

function parseUrl(url: string): MediaInfo | undefined {
    const [, mediumName, title ] = url.split("/");

    const medium = MEDIA_URL_NAMES[mediumName];
    if (!medium || !title) return undefined;

    return { medium, title };
}

function getVoiceLanguages(): MediaLanguage[] {
    const filters = document.getElementById("medium_chars_view_by");
    if (!filters) {
        throw new Error("Couldn't find element with id 'medium_chars_view_by' on voice page");
    }

    const languages = [
        MediaLanguage.English,
    ];

    if (Array.from(filters.children).some(element => element.innerHTML == "Japanese cast")) {
        languages.push(MediaLanguage.Japanese);
    }

    return languages;
}

function createButton(entry: MediaEntry, state: ApplicationState): Node {
    const button = document.createElement("button");
    const present = state.mediaList.contains(entry);
    
    button.innerHTML = `${!present ? "+ Add to" : "- Remove from"} list`;
    button.classList.add(`pop-filter-${!present ? "add" : "remove"}`);
    button.classList.add(`pop-filter-button`);

    button.onclick = async () => {
        if (present) {
            state.mediaList.add(entry);
        } else {
            state.mediaList.remove(entry);
        }

        await state.mediaList.saveToStorage();

        button.remove();
        createButton(entry, state);
    }

    return button;
}