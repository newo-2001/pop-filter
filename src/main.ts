import "reflect-metadata";
import "./service-registry";
import { container, } from "tsyringe";
import { MediaList } from "./models/media-list";
import { loadConfiguration } from "./configuration";
import { ContentInjector } from "./abstractions/content-injector";
import { ApplicationState } from "./models/application-state";
import { TOKENS } from "./abstractions/tokens";

const state: ApplicationState = {
    configuration: await loadConfiguration(),
    mediaList: await MediaList.fromStorage(),
    url: window.location.pathname
};

container.registerInstance<ApplicationState>(TOKENS.State, state);

container.resolveAll<ContentInjector>(TOKENS.ContentInjector)
    .forEach(injector => injector.injectContent());