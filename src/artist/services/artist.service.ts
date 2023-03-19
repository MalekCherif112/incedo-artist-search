import axios from "axios";
import {ArtistSearchResponse, LastFmArtistsDto} from "../models/last-fm-artists.dto";
import {ArtistDto} from "../models/artist.dto";

const BASE_URL = "http://ws.audioscrobbler.com/2.0/";

const PARAMS = [
    ["method", "artist.search"],
    ["api_key", process.env.LAST_FM_API_KEY || ""],
    ["format", "json"]
]

function getQueryParams(artist: string, limit: string, page: string): URLSearchParams {
    return new URLSearchParams([
        ...PARAMS,
        ["artist", artist],
        ["limit", limit],
        ["page", page]
    ]);
}

function searchArtistByName(searchQuery: string, limit: string, page: string): Promise<ArtistDto[]> {
    return axios.get<ArtistSearchResponse>(
        BASE_URL,
        {params: getQueryParams(searchQuery, limit, page)}
    )
        .then(res => res.data?.results?.artistmatches?.artist)
        .then(artists => artists.map(artist => ArtistDto.fromLastFmResponse(artist)));
}

function generateCsvFile(searchQuery: string, limit: string, page: string): Promise<string> {
    return searchArtistByName(searchQuery, limit, page)
        .then(artists => artists.map(artist => artist.toCsvLine()).join('\n'))
        .then(csvBody => ArtistDto.getCsvHeaders() + csvBody );
}

module.exports = {
    searchArtistByName,
    generateCsvFile
}