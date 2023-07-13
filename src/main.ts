import { MediaList } from "./models/media-list";
import { loadConfiguration } from "./configuration";
import { ContentInjector } from "./abstractions/content-injector";
import { ApplicationState } from "./models/application-state";
import { injectMediaButons } from "./injectors/media-button-injector";
import { filterRoles } from "./injectors/role-filter";

const state: ApplicationState = {
    configuration: await loadConfiguration(),
    mediaList: await MediaList.fromStorage(),
    url: window.location.pathname
}

const injectors: ContentInjector[] = [
    injectMediaButons,
    filterRoles
]

for (const injector of injectors) {
    injector(state);
}