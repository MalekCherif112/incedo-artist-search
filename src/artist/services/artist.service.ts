import axios from "axios";
import {ArtistSearchResponse, LastFmArtistsDto} from "../models/last-fm-artists.dto";
import {ArtistDto} from "../models/artist.dto";

const PARAMS = [
    ["method", "artist.search"],
    ["api_key", process.env.LAST_FM_API_KEY || ""],
    ["format", "json"]
]

function getQueryParams(artist: string): URLSearchParams{
    return new URLSearchParams([
        ...PARAMS, ["artist", artist]
    ]);
}

async function searchArtistByName(searchQuery: string){

    try {
        const artists: LastFmArtistsDto[]  = await axios.get<ArtistSearchResponse>(
            "http://ws.audioscrobbler.com/2.0/",
            {params: getQueryParams(searchQuery)}
        ).then(res =>  res.data?.results?.artistmatches?.artist);

        return artists.map(artist => ArtistDto.fromLastFmResponse(artist));
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    searchArtistByName
}