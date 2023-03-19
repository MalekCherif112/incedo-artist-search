import axios from "axios";

const fs = require('fs');

import {ArtistSearchResponse} from "../models/last-fm-artists.dto";
import {ArtistDto} from "../models/artist.dto";
import {WRITING_TO_JSON_ERROR} from "../../common/error-code";

const BASE_URL = "http://ws.audioscrobbler.com/2.0/";
const JSON_FALLBACK_FILE = __dirname + "/random_artists.json";

const PARAMS = [
    ["method", "artist.search"],
    ["api_key", process.env.LAST_FM_API_KEY || ""],
    ["format", "json"]
]

function searchArtistByNameOrFallBack(searchQuery: string, limit: string, page: string = "1"): Promise<ArtistDto[]> {
    return searchArtistByName(searchQuery, limit, page).then(
        (artists) => artists.length ? artists : getFallBackArtists(limit)
    )
}

function generateCsvFile(searchQuery: string, limit: string, page: string): Promise<string> {
    return searchArtistByNameOrFallBack(searchQuery, limit, page)
        .then(artists => artists.map(artist => artist.toCsvLine()).join('\n'))
        .then(csvBody => ArtistDto.getCsvHeaders() + csvBody);
}

function generateJsonFallbackFile() {
    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 20 artists for each character
    return Promise.all(alphabets.map(letter => searchArtistByName(letter, "20")))
        .then((lists: ArtistDto[][]) => lists.flat())
        .then((list) =>
            new Promise((resolve, reject) =>
                fs.writeFile(JSON_FALLBACK_FILE,
                    JSON.stringify(list), (err: Error) => {
                        if (err) {
                            reject(WRITING_TO_JSON_ERROR);
                        }
                        resolve("write success")
                    }
                )
            )
        );
}

function getQueryParams(artist: string, limit: string, page: string): URLSearchParams {
    return new URLSearchParams([
        ...PARAMS,
        ["artist", artist],
        ["limit", limit],
        ["page", page]
    ]);
}

function searchArtistByName(searchQuery: string, limit: string, page: string = "1"): Promise<ArtistDto[]> {
    return axios.get<ArtistSearchResponse>(
        BASE_URL,
        {params: getQueryParams(searchQuery, limit, page)}
    )
        .then(res => res.data?.results?.artistmatches?.artist)
        .then(artists => artists.map(artist => ArtistDto.fromLastFmResponse(artist)));
}

function getFallBackArtists(limit: string): ArtistDto[] {

    try {
        //To return a string instead of a Promise
        const artists: ArtistDto[] = JSON.parse(fs.readFileSync(JSON_FALLBACK_FILE));
        return artists.sort(() => 0.5 - Math.random())
            .slice(0, parseInt(limit))
            .map(item => new ArtistDto(item.name, item.mbid, item.url, item.image_small, item.image))
    } catch (err) {
        return [];
    }


}

module.exports = {
    searchArtistByNameOrFallBack,
    generateCsvFile,
    generateJsonFallbackFile
}