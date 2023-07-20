import { container, registry } from "tsyringe";
import { TOKENS } from "./abstractions/tokens";
import { MediaButtonInjector } from "./content-injectors/media-button-injector";
import { RoleFilter } from "./content-injectors/role-filter";
import { MediaListService } from "./services/media-list-service";
import { MediaList } from "./models/media-list";
import { ConfigurationService } from "./services/configuration-service";
import { ChromeStorageProvider } from "./services/chrome-storage-provider";

container.register(TOKENS.StorageProvider, ChromeStorageProvider);

const mediaListService = container.resolve(MediaListService);
const configService = container.resolve(ConfigurationService);

const [ mediaList, config ] = await Promise.all([
    mediaListService.getList(),
    configService.getConfiguration()
]);

@registry([
    { token: TOKENS.ContentInjector, useClass: MediaButtonInjector },
    { token: TOKENS.ContentInjector, useClass: RoleFilter },
    { token: TOKENS.Configuration, useValue: config },
    { token: MediaList, useValue: mediaList },
])
export default class Registry { }