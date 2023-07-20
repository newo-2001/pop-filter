import "reflect-metadata";
import "./service-registry";
import { container, } from "tsyringe";
import { MediaList, MediaListManifest } from "./models/media-list";
import { TOKENS } from "./abstractions/tokens";
import { Configuration } from "./configuration";
import { ConfigurationService } from "./services/configuration-service";
import { MediaListService } from "./services/media-list-service";

const mediaListService = container.resolve(MediaListService);
const configService = container.resolve(ConfigurationService);
const config = container.resolve<Configuration>(TOKENS.Configuration);
const mediaList = container.resolve(MediaList);

document.getElementById("import-button")?.addEventListener("click", importList);
document.getElementById("export-button")?.addEventListener("click", exportList);
document.getElementById("delete-button")?.addEventListener("click", deleteList);

updateEntryCount(mediaList.cardinality());

const filteringEnabled = document.getElementById("filtering-enabled") as HTMLInputElement;
filteringEnabled.checked = config.enableFiltering;
filteringEnabled.addEventListener("change", async () => {
    config.enableFiltering = filteringEnabled.checked;
    await configService.saveConfiguration(config);
});

const languageFilterEnabled = document.getElementById("language-filter-enabled") as HTMLInputElement;
languageFilterEnabled.checked = config.enableLanguageFilter;
languageFilterEnabled.addEventListener("change", async () => {
    config.enableLanguageFilter = languageFilterEnabled.checked;
    await configService.saveConfiguration(config);
});

async function exportList(): Promise<void> {
    // Retrieve list from storage to synchronize with the content scripts
    // This should actually be done via message passing
    const list = await mediaListService.getList();
    const data = JSON.stringify(list.manifest());
    const blob = new Blob([ data ], { type: "text/json" });

    const anchor = document.createElement("a");
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = "media-list.json";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

async function importList(): Promise<MediaList> {
    return new Promise((resolve, reject) => {
        const fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", ".json");
        
        fileInput.onchange = async () => {
            const file = fileInput?.files?.[0];
            if (!file) {
                return reject("Failed to select file");
            }

            const content = await file!.text()
            const manifest = JSON.parse(content) as MediaListManifest;
            const list = new MediaList(manifest);
            await mediaListService.saveList(list);
            
            updateEntryCount(list.cardinality());

            resolve(list);
        }

        fileInput.click();
    })
}

function deleteList(): Promise<void> {
    updateEntryCount(0);
    return mediaListService.deleteList();
}

function updateEntryCount(count: number) {
    document.getElementById("entry-count")!.innerHTML = "" + count;
    document.getElementById("entry-count-plural")!.innerHTML = count == 1 ? "y" : "ies";
}