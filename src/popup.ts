import { loadConfiguration, saveConfiguration } from "./configuration";
import { MediaList } from "./models/media-list";

const config = await loadConfiguration();
const mediaList = await MediaList.fromStorage();

document.getElementById("manage-button")?.addEventListener("click", manage);

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

async function manage() {
    await chrome.tabs.create({
        url: chrome.runtime.getURL("manage.html")
    });
}

function updateEntryCount(count: number) {
    document.getElementById("entry-count")!.innerHTML = "" + count;
    document.getElementById("entry-count-plural")!.innerHTML = count == 1 ? "y" : "ies";
}
