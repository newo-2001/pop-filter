import { registry } from "tsyringe";
import { TOKENS } from "./abstractions/tokens";
import { MediaButtonInjector } from "./content-injectors/media-button-injector";
import { RoleFilter } from "./content-injectors/role-filter";

@registry([
    { token: TOKENS.ContentInjector, useClass: MediaButtonInjector },
    { token: TOKENS.ContentInjector, useClass: RoleFilter },
])
export default class Registry { }