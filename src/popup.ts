import { loadConfiguration, saveConfiguration } from "./configuration";
import { MediaList } from "./models/media-list";

const config = await loadConfiguration();
const mediaList = await MediaList.fromStorage();

document.getElementById("import-button")?.addEventListener("click", importList);
document.getElementById("export-button")?.addEventListener("click", exportList);
document.getElementById("delete-button")?.addEventListener("click", deleteList);

updateEntryCount(mediaList.cardinality());

const filteringEnabled = document.getElementById("filtering-enabled") as HTMLInputElement;
filteringEnabled.checked = config.enableFiltering;
filteringEnabled.addEventListener("change", async () => {
    config.enableFiltering = filteringEnabled.checked;
    await saveConfiguration(config);
});

const languageFilterEnabled = document.getElementById("language-filter-enabled") as HTMLInputElement;
languageFilterEnabled.checked = config.enableLanguageFilter;
languageFilterEnabled.addEventListener("change", async () => {
    config.enableLanguageFilter = languageFilterEnabled.checked;
    await saveConfiguration(config);
});

async function exportList(): Promise<void> {
    const list = (await MediaList.fromStorage()).serializeJson();
    const blob = new Blob([list], { type: "text/json" });

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
            const list = MediaList.deserializeJson(content);
            await list.saveToStorage();
            
            updateEntryCount(list.cardinality());

            resolve(list);
        }

        fileInput.click();
    })
}

function deleteList(): Promise<void> {
    updateEntryCount(0);
    return MediaList.clearStorage();
}

function updateEntryCount(count: number) {
    document.getElementById("entry-count")!.innerHTML = "" + count;
    document.getElementById("entry-count-plural")!.innerHTML = count == 1 ? "y" : "ies";
}