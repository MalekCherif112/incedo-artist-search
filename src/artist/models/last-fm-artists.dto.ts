export class ArtistSearchResponse {
    results: {
        artistmatches: {
            artist: LastFmArtistsDto[]
        }
    }

}

export class LastFmArtistsDto {
    name: string;
    mbid: string;
    url: string;
    image: LastFmImage[];
}

export class LastFmImage {
    "#text": string;
    size: "small" | "medium" | "large" | "extralarge" | "mega";
}