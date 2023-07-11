import { MediaList } from "./media-list";
import { loadConfiguration } from "./configuration";

type MediaButtonType = "add" | "remove";

const [ _, category, title, character ] = window.location.pathname.split("/");

const MEDIA_TYPES = [ "tv-shows", "video-games", "movies" ];
const VALID_MEDIA_TYPES = [ ...MEDIA_TYPES, "shorts", "ride-attractions", "commercials" ];

const config = await loadConfiguration();
const mediaList = await MediaList.fromStorage();

await hydrate();

async function hydrate() {
    if (MEDIA_TYPES.includes(category) && title) {
        hydrateMedia(title);
    } else if (!VALID_MEDIA_TYPES.includes(category) && config.enableFiltering) {
        await hydrateVA();
    }
}

async function hydrateVA() {
    const rolesContainer = document.getElementById("credit_pics_voiceactors");
    if (!rolesContainer) {
        return console.error("Missing credit_pics_voiceactors element on voice actor page");
    }

    await forceLazyEvaluation();

    const roles = findAllVoiceRoles()
        .map(tag => ({ name: extractNameFromRole(tag as HTMLDivElement), tag }))
        .filter(role => !mediaList.contains(role.name));

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

function hydrateMedia(title: string) {
    const header = document.getElementById("medium_heading");
    if (!header) {
        return console.error("Missing medium_heading element on media page");
    }
    
    const type = mediaList.contains(title) ? "remove" : "add";
    header?.after(createButton(type, title))
}

function createButton(type: MediaButtonType, title: string): Node {
    const button = document.createElement("button");
    
    button.innerHTML = `${type == "add" ? "+ Add to" : "- Remove from"} list`;
    button.classList.add(`pop-filter-button`);
    button.classList.add(`pop-filter-${type}`);

    button.onclick = async () => {
        type == "add" ? mediaList.add(title) : mediaList.remove(title);
        await mediaList.saveToStorage();

        button.remove();
        hydrateMedia(title);
    }

    return button;
}

function extractNameFromRole(tag: HTMLDivElement): string {
    const role = tag.firstChild as HTMLAnchorElement;
    const parts = role.href.split("/");

    const name = parts[parts.length-2];
    return name;
}

function sleep(delay: number): Promise<void> {
    return new Promise((resolve, _) => {
        setTimeout(resolve, delay);
    })
}