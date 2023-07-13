import { Configuration } from "../configuration";
import { MediaList } from "./media-list";

export interface ApplicationState {
    configuration: Configuration,
    mediaList: MediaList,
    url: string
}