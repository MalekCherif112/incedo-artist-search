import {LastFmArtistsDto, LastFmImage} from "./last-fm-artists.dto";

export class ArtistDto {
    name: string;
    mbid: string;
    url: string;
    image_small: string;
    image: string;

    constructor(name: string, mbid: string, url: string, image_small: string, image: string) {
        this.name = name;
        this.mbid = mbid;
        this.url = url;
        this.image_small = image_small;
        this.image = image;
    }

    static fromLastFmResponse(dto: LastFmArtistsDto) {
        const small_image: LastFmImage = dto.image.find(image => image.size === "small");
        const small_image_url: string = small_image ? small_image["#text"] : "";

        const large_image: LastFmImage = dto.image.find(image => image.size === "large");
        const large_image_url: string = large_image ? large_image["#text"] : "";

        return new ArtistDto(dto.name, dto.mbid, dto.url, small_image_url, large_image_url);
    }

    static getCsvHeaders() {
        return "name,mbid,url,image_small,image\n";
    }

    toCsvLine() {
        return this.name + ',' + this.mbid + ',' + this.url + ',' + this.image_small + ',' + this.image;
    }
}