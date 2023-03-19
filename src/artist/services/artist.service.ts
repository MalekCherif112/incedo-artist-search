import axios from "axios";
import {ArtistSearchResponse, LastFmArtistsDto} from "../models/last-fm-artists.dto";
import {ArtistDto} from "../models/artist.dto";

const PARAMS = [
    ["method", "artist.search"],
    ["api_key", process.env.LAST_FM_API_KEY || ""],
    ["format", "json"]
]

function getQueryParams(artist: string): URLSearchParams {
    return new URLSearchParams([
        ...PARAMS, ["artist", artist]
    ]);
}

function searchArtistByName(searchQuery: string): Promise<ArtistDto[]> {

    return axios.get<ArtistSearchResponse>(
        "http://ws.audioscrobbler.com/2.0/",
        {params: getQueryParams(searchQuery)}
    )
        .then(res => res.data?.results?.artistmatches?.artist)
        .then(artists => artists.map(artist => ArtistDto.fromLastFmResponse(artist)));
}

module.exports = {
    searchArtistByName
}