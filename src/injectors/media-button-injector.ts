import { ApplicationState } from "../models/application-state";
import { MediaEntry } from "../models/media-entry";
import { MediaLanguage, flagForLanguage } from "../models/media-language";
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

const buttonsContainer = document.createElement("div");
buttonsContainer.id = "pop-filter-buttons-container";

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

        buttonsContainer.appendChild(createButton(entry, state));
    }

    header.appendChild(buttonsContainer);
    return Promise.resolve(true);
}

function parseUrl(url: string): MediaInfo | undefined {
    const [, mediumName, title, extra ] = url.split("/");

    const medium = MEDIA_URL_NAMES[mediumName];
    if (medium == undefined || !title || extra) return undefined;

    return { medium, title };
}

function getVoiceLanguages(): MediaLanguage[] {
    const filtersContainer = document.getElementById("medium_chars_view_by");
    if (!filtersContainer) {
        throw new Error("Couldn't find element with id 'medium_chars_view_by' on voice page");
    }

    const filters = Array.from(filtersContainer.children);

    if (filters.some(element => element.innerHTML == "Japanese Cast")) {
        return [ MediaLanguage.English, MediaLanguage.Japanese ]
    } else if (filters.some(element => element.innerHTML == "Japanese Voice Cast")) {
        return [ MediaLanguage.Japanese ];
    }

    return [MediaLanguage.English]
}

function createButton(entry: MediaEntry, state: ApplicationState): Node {
    const present = state.mediaList.contains(entry);
    
    const button = document.createElement("div");
    button.classList.add(`pop-filter-${!present ? "confirm" : "danger"}`);
    button.classList.add(`pop-filter-button`);
    
    const text = document.createElement("span");
    text.innerText = `${!present ? "+ Add to" : "- Remove from"} list`;
    button.appendChild(text);

    const img = document.createElement("img");
    const flag = flagForLanguage(entry.language);
    img.src = chrome.runtime.getURL(flag);
    button.appendChild(img);

    button.onclick = async () => {
        if (!present) {
            state.mediaList.add(entry);
        } else {
            state.mediaList.remove(entry);
        }

        await state.mediaList.saveToStorage();

        buttonsContainer.replaceChild(createButton(entry, state), button);
    }

    return button;
}
