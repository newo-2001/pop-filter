import { ApplicationState } from "../models/application-state";
import { MediaEntry } from "../models/media-entry";
import { MediaLanguage } from "../models/media-language";
import { MEDIA_URL_NAMES } from "../models/medium";
import { sleep } from "../utils";

export async function filterRoles(state: ApplicationState): Promise<void> {
    const rolesContainer = document.getElementById("credit_pics_voiceactors");
    if (!rolesContainer) {
        return console.error("Missing credit_pics_voiceactors element on voice actor page");
    }

    await forceLazyEvaluation();

    const roles = findAllVoiceRoles()
        .map(tag => ({ entry: extractEntryFromRoleElement(tag as HTMLDivElement), tag }))
        .filter(role => !state.mediaList.contains(role.entry));

    for (const role of roles) {
        role.tag.remove();
    }
}

// This function is hella sketchy
async function forceLazyEvaluation(): Promise<void> {
    let previousLoaded, currentLoaded;

    do {
        previousLoaded = currentLoaded;

        const lazyLoad = document.getElementById("show_rest")?.firstChild;
        if (lazyLoad instanceof HTMLImageElement) {
            lazyLoad.scrollIntoView({ behavior: "instant" });
            await sleep(500);
        }

        currentLoaded = findAllVoiceRoles().length;
    } while (!previousLoaded || previousLoaded < currentLoaded)

    window.scrollTo(0, 0);
}

function findAllVoiceRoles(): ChildNode[] {
    return Array.from(document.getElementById("credit_pics_voiceactors")?.childNodes ?? [])
        .concat(Array.from(document.getElementById("remaining_roles")?.childNodes ?? []))
        .filter(tag => tag instanceof HTMLDivElement && tag.className.startsWith("medium_msn"));
}

function extractEntryFromRoleElement(tag: HTMLDivElement): MediaEntry {
    const role = tag.firstChild as HTMLAnchorElement;
    const [,,, mediumName, title ] = role.href.split("/");
    
    const medium = MEDIA_URL_NAMES[mediumName];
    if (!medium) {
        throw new Error(`Failed to extract medium from role ${role.href}`);
    }

    return { medium, title, language: getVoiceLanguage() }
}

const languageNames: { [key: string]: MediaLanguage } = {
    "English": MediaLanguage.English,
    "Japanese": MediaLanguage.Japanese
}

function getVoiceLanguage(): MediaLanguage {
    const flag = document.getElementsByClassName("va_flag").item(0);
    const languageName = flag?.getAttribute("alt") ?? "English";
    
    return languageNames[languageName];
}