export enum Medium {
    TVShow,
    Movie,
    VideoGame,
    Short,
    Commercial,
    RideAttraction
}

export const MEDIA_URL_NAMES: { [key: string]: Medium } = {
    "tv-shows": Medium.TVShow,
    "movies": Medium.Movie,
    "shorts": Medium.Short,
    "video-games": Medium.VideoGame,
    "commercials": Medium.Commercial,
};