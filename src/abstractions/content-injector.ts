import { ApplicationState } from "../models/application-state"

export type ContentInjector = (state: ApplicationState) => Promise<void>;