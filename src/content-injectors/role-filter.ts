import { injectable, inject } from "tsyringe";
import { ContentInjector } from "../abstractions/content-injector";
import { TOKENS } from "../abstractions/tokens";
import { MediaEntry } from "../models/media-entry";
import { MediaLanguage } from "../models/media-language";
import { MEDIA_URL_NAMES } from "../models/medium";
import { sleep } from "../utils";
import { Configuration } from "../configuration";
import { MediaList } from "../models/media-list";

@injectable()
export class RoleFilter implements ContentInjector {
    public constructor(
        @inject(MediaList) private readonly mediaList: MediaList,
        @inject(TOKENS.Configuration) private readonly config: Configuration,
        @inject(TOKENS.Url) private readonly url: string
    ) { }

    public async injectContent(): Promise<boolean> {
        if (!this.isVoiceActorPage() || !this.config.enableFiltering) return false;

        const rolesContainer = document.getElementById("credit_pics_voiceactors");
        if (!rolesContainer) {
            throw new Error("Missing credit_pics_voiceactors element on voice actor page");
        }

        await RoleFilter.forceLazyEvaluation();

        RoleFilter.findAllVoiceRoles()
            .map(tag => ({ entries: this.extractEntriesFromRoleElement(tag as HTMLDivElement), tag }))
            .filter(role => {
                return !role.entries.some(entry => this.mediaList.contains(entry))
            }).forEach(role => role.tag.remove());

        return true;
    }

    private isVoiceActorPage(): boolean {
        const [, section ] = this.url.split("/");
        return !!section && !NOT_VA_SECTIONS.includes(section);
    }

    private extractEntriesFromRoleElement(tag: HTMLDivElement): MediaEntry[] {
        const role = tag.firstChild as HTMLAnchorElement;
        const [,,, mediumName, title ] = role.href.split("/");
        
        const medium = MEDIA_URL_NAMES[mediumName];
        if (!medium) {
            throw new Error(`Failed to extract medium from role ${role.href}`);
        }
        
        return this.config.enableLanguageFilter
            ? [ new MediaEntry({ medium, title, language: RoleFilter.getVoiceLanguage() }) ]
            : Object.values(MediaLanguage).map(language => new MediaEntry({
                medium, title, language
            }));
    }

    // This function is hella sketchy
    private static async forceLazyEvaluation(): Promise<void> {
        let previousLoaded, currentLoaded;

        do {
            previousLoaded = currentLoaded;

            const lazyLoad = document.getElementById("show_rest")?.firstChild;
            if (lazyLoad instanceof HTMLImageElement) {
                lazyLoad.scrollIntoView({ behavior: "instant" });
                await sleep(500);
            }

            currentLoaded = RoleFilter.findAllVoiceRoles().length;
        } while (!previousLoaded || previousLoaded < currentLoaded)

        window.scrollTo(0, 0);
    }

    private static findAllVoiceRoles(): ChildNode[] {
        return Array.from(document.getElementById("credit_pics_voiceactors")?.childNodes ?? [])
            .concat(Array.from(document.getElementById("remaining_roles")?.childNodes ?? []))
            .filter(tag => tag instanceof HTMLDivElement && tag.className.startsWith("medium_msn"));
    }

    private static getVoiceLanguage(): MediaLanguage {
        const flag = document.getElementsByClassName("va_flag").item(0);
        const languageName = flag?.getAttribute("alt") ?? "English";
        
        return languageNames[languageName];
    }
}

const NOT_VA_SECTIONS: string[] = [
    ...Object.keys(MEDIA_URL_NAMES),
    "team-ups", "voice-compare",
    "voice-directors", "franchises",
    "news", "top-listings", "coming-soon",
    "quotes", "forums", "about",
    "content-guidelines", "contact",
    "terms-of-use", "privacy-policy",
    "franchises", "search"
];

const languageNames: { [key: string]: MediaLanguage } = {
    "English": MediaLanguage.English,
    "Japanese": MediaLanguage.Japanese
}