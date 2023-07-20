import "reflect-metadata";
import "./service-registry";
import { container, } from "tsyringe";
import { ContentInjector } from "./abstractions/content-injector";
import { TOKENS } from "./abstractions/tokens";

container.registerInstance(TOKENS.Url, window.location.pathname);

container.resolveAll<ContentInjector>(TOKENS.ContentInjector)
    .forEach(injector => injector.injectContent());