import { loadConfiguration, saveConfiguration } from "./configuration";
import { MediaList } from "./media-list";

const config = await loadConfiguration();

document.getElementById("import-button")?.addEventListener("click", importList);
document.getElementById("export-button")?.addEventListener("click", exportList);

const filteringEnabled = document.getElementById("filtering-enabled") as HTMLInputElement;
filteringEnabled.checked = config.enableFiltering;
filteringEnabled.addEventListener("change", async () => {
    config.enableFiltering = filteringEnabled.checked;
    await saveConfiguration(config);
});


async function exportList(): Promise<void> {
    const list = (await MediaList.fromStorage()).asJson();
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
                reject("Failed to select file");
            }

            const content = await file!.text()
            const entries = JSON.parse(content);
            const list = new MediaList(entries);
            
            await list.saveToStorage();

            resolve(list);
        }

        fileInput.click();
    })
}