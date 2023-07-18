export enum Medium {
    TVShow = "tv-show",
    Movie = "movie",
    VideoGame = "game",
    Short = "short",
    Commercial = "commercial",
    RideAttraction = "attraction"
}

export const MEDIA_URL_NAMES: { [key: string]: Medium } = {
    "tv-shows": Medium.TVShow,
    "movies": Medium.Movie,
    "shorts": Medium.Short,
    "video-games": Medium.VideoGame,
    "commercials": Medium.Commercial,
    "rides-attractions": Medium.RideAttraction
};