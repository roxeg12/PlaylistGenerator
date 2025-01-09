import type { JSONSchema } from "json-schema-to-ts";
import { FromSchema } from "json-schema-to-ts";
import { $Compiler, wrapCompilerAsTypeGuard } from "json-schema-to-ts";
import Ajv from "ajv";
import {OpenAI} from "openai"

// An interface for an API request
interface Request {
    method?: string;
    headers: {
      [x: string]: string;
      Authorization: string;
    };
    body?: string;
}

interface ChatRequest {
    model: string,
    messages: ChatMessage[]
}

interface ChatMessage {
    role: string,
    content: string
}

interface TrackImage {
    url: string;
    height: number;
    width: number;
}

interface SongData {
    title: string;
    artists: string[];
    img: TrackImage;
}

const ajv = new Ajv();
const $compile: $Compiler = (schema) => ajv.compile(schema);
const compile = wrapCompilerAsTypeGuard($compile);

type TypeGuard<T> = (data: unknown) => data is T;

const GenreListScema = {
    $id: "genre-list.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "GenreList",
    type: "array",
    items: {
        type: "string",
    },
} as const satisfies JSONSchema;

export type GenreList = FromSchema<typeof GenreListScema>;

let isGenreList = compile(GenreListScema);

const OpenAIResponseSchema = {
    $id: "openai-response.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "OpenAIResponse",
    type: "object",
    required: ["id", "object", "created", "usage", "choices"],
    properties: {
        id: {type: "string"},
        object: {type: "string"},
        created: {type: "number"},
        model: {type: "string"},
        usage: {
            type: "object",
        },
        choices: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    message: {
                        type: "object",
                        required: ["content"],
                        properties: {
                            role: {type: "string"},
                            content: {type: "string"}
                        }
                    },
                    index: {type: "number"}
                },
                additionalProperties: true
            }
        }
    },
    additionalProperties: true
} as const satisfies JSONSchema;

export type OpenAIReponse = FromSchema<typeof OpenAIResponseSchema>;

let isOpenAIResponse = compile(OpenAIResponseSchema);

const SpotifyAccessTokenResponseSchema = {
    $id: "spotify-token-reponse.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyAccessTokenResponse",
    type: "object",
    required: ["access_token", "token_type", "expires_in"],
    properties: {
        "access_token": {type: "string"},
        "token_type": {type: "string"},
        "expires_in": {type: "number"}
    }
} as const satisfies JSONSchema;

export type SpotifyAccessTokenResponse = FromSchema<typeof SpotifyAccessTokenResponseSchema>;

let isSpotifyAccessTokenResponse = compile(SpotifyAccessTokenResponseSchema);


const SpotifyImgObjectSchema = {
    $id: "spotify-img.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyImgObject",
    required: ["url", "height", "width"],
    type: "object",
    properties: {
        url: {type: "string"},
        height: {type: "number"},
        width: {type: "number"}
    },
    additionalProperties: false,
} as const satisfies JSONSchema;

export type SpotifyImgObject = FromSchema<typeof SpotifyImgObjectSchema>;

let isSpotifyImgObject = compile(SpotifyImgObjectSchema);

const SpotifySimpleArtistObjectSchema = {
    $id: "spotify-artist-simple.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifySimpleArtistObject",
    type: "object",
    required: ["id", "name", "type", "uri"],
    properties: {
        id: {type: "string"},
        name: {type: "string"},
        type: {type: "string"},
        uri: {type: "string"},
    },
    additionalProperties: true
} as const satisfies JSONSchema;

export type SpotifySimpleArtistObject = FromSchema<typeof SpotifySimpleArtistObjectSchema>;

let isSpotifySimpleArtistObject = compile(SpotifySimpleArtistObjectSchema);

const SpotifyArtistObjectSchema = {
    $id: "spotify-artist.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyArtistObject",
    type: "object",
    required: ["genres", "href", "id", "name"],
    properties: {
        genres: {
            type: "array",
            items: {
                type: "string"
            }
        },
        href: {type: "string"},
        id: {type: "string"},
        name: {type: "string"}
    },
    additionalProperties: true
} as const satisfies JSONSchema;

export type SpotifyArtistObject = FromSchema<typeof SpotifyArtistObjectSchema>;

let isSpotifyArtistObject = compile(SpotifyArtistObjectSchema);

const SpotifyAlbumObjectSchema = {
    $id: "spotify-album.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyAlbumObject",
    type: "object",
    required: ["album_type", "id", "total_tracks", "available_markets", "external_urls", "href", "images", "name", "release_date", "type", "uri", "artists"],
    properties: {
        "album_type": {type: "string"},
        "total_tracks": {type: "number"},
        "available_markets": {
            type: "array",
            items: {type: "string"},
        },
        "external_urls": {type: "object"},
        href: {type: "string"},
        id: {type: "string"},
        images: {
            type: "array",
            items: {
                //$ref: "spotify-img.json"
            }
        },
        name: {type: "string"},
        "release_date": {type: "string"},
        "release_date_precision": {type: "string"},
        type: {type: "string"},
        uri: {type: "string"},
        artists: {
            type: "array",
            items: {
                $ref: "spotify-artist-simple.json"
            }
        }
    }
} as const satisfies JSONSchema;

export type SpotifyAlbumObject = FromSchema<typeof SpotifyAlbumObjectSchema, {references: [typeof SpotifyImgObjectSchema, typeof SpotifySimpleArtistObjectSchema]}>;

let isSpotifyAlbumObject = compile(SpotifyAlbumObjectSchema);

const SpotifyArtistArraySchema = {
    $id: "spotify-artist-array.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyArtistArray",
    type: "array",
    items: {
        $ref: "spotify-artist-simple.json"
    }
} as const satisfies JSONSchema;

export type SpotifyArtistArray = FromSchema<typeof SpotifyArtistArraySchema, {references: [typeof SpotifySimpleArtistObjectSchema]}>;

let isSpotifyArtistArray = compile(SpotifyArtistArraySchema);

const SpotifyTrackObjectSchema = {
    $id: "spotify-track.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyTrackObject",
    type: "object",
    required: ["popularity", "name", "explicit"],
    properties: {
        album: {
            type: "object"
            //$ref: "spotify-album.json"
        },
        artists: {
            type: "array",
            items: {
                //$ref: "spotify-artist-simple.json"
            }
        },
        "available_markets": {
            type: "array",
            items: {
                type: "string"
            }
        },
        explicit: {type: "boolean"},
        "external_ids": {
            type: "object",
            properties: {
                isrc: {type: "string"},
                ean: {type: "string"},
                upc: {type: "string"}
            }
        },
        "external_urls": {
            type: "object",
            properties: {
                spotify: {type: "string"}
            }
        },
        href: {type: "string"},
        id: {type: "string"},
        name: {type: "string"},
        popularity: {type: "number"},
        type: {type: "string"},
        uri: {type: "string"},
    },
    additionalProperties: true
} as const satisfies JSONSchema;

export type SpotifyTrackObject = FromSchema<typeof SpotifyTrackObjectSchema, {references: [typeof SpotifyAlbumObjectSchema, typeof SpotifySimpleArtistObjectSchema, typeof SpotifyImgObjectSchema]}>;

let isSpotifyTrackObject = compile(SpotifyTrackObjectSchema);

const SpotifySearchResponseSchema = {
    $id: "search-response.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifySearchResponse",
    type: "object",
    required: ["href", "limit", "offset", "total", "items"],
    properties: {
        href: {type: "string"},
        limit: {type: "number"},
        next: {type: ["string", "null"]},
        offset: {type: "number"},
        previous: {type: ["string", "null"]},
        total: {type: "number"},
        items: {
            type: "array",
            items: {
                type: "object"
            }
        }
    },
    additionalProperties: false
} as const satisfies JSONSchema;

export type SpotifySearchResponse = FromSchema<typeof SpotifySearchResponseSchema>;

let isSpotifySearchResponse = compile(SpotifySearchResponseSchema);

const SpotifyRealSearchSchema = {
    $id: "real-search-response.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyRealSearchResponse",
    type: "object",
    properties: {
        tracks: {
            type: "object",
            //$ref: "search-response.json",
        },
        artists: {type: "object"},
        albums: {type: "object"},
        playlists: {type: "object"},
        shows: {type: "object"},
        episodes: {type: "object"},
        audiobooks: {type: "object"},
    },
    additionalProperties: true,
} as const satisfies JSONSchema;

export type SpotifyRealSearchResponse = FromSchema<typeof SpotifyRealSearchSchema>;

let isSpotifyRealSearchResponse = compile(SpotifyRealSearchSchema);

/*
const SpotifySearchArtistResponseSchema = {
    $id: "search-artist.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifySearchArtist",
    type: "object",
    required: ["artists"],
    properties: {
        artists: {
            type: "object",

        },
    },
    additionalProperties:true
} as const satisfies JSONSchema;

export type SpotifyArtistSearch = FromSchema<typeof SpotifySearchArtistResponseSchema, {references: [typeof SpotifySearchResponseSchema]}>;
let isSpotifyArtistSearch = compile(SpotifySearchArtistResponseSchema);*/

/*
const SpotifySearchTrackResponseSchema = {
    $id: "search-track.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifySearchTrack",
    type: "object",
    required: ["tracks"],
    properties:{
        tracks: {
            type: "object",
        },
    },
    additionalProperties: true,
} as const satisfies JSONSchema;

export type SpotifySearchTrack = FromSchema<typeof SpotifySearchTrackResponseSchema>;
let isSpotifySearchTrack = compile(SpotifySearchTrackResponseSchema);*/

export function typedFetch<T>(
    url: string,
    validate: TypeGuard<T>,
    options?: RequestInit,
  ): Promise<T> {
    console.log(`typedFetch(${url}, ${options})`);
    console.log(options);
    return fetch(url, options).then((response: Response) => {
      if (!response.ok) {
        console.log(response.text);
        throw new Error(response.statusText);
      }
  
      return response.text().then((text: string) => {
        let data: unknown;
  
        console.log(text);
  
        if (text.length !== 0) {
          data = JSON.parse(text);
        }
  
        if (validate(data)) {
          return data;
        }
        throw new Error(`invalid response: ${text}`);
      });
    });
  }

export class OpenAIModel {
    private accessKey: string;
    private timestamp: Date;

    private url: string;

    private openAi: OpenAI;

    constructor(key: string, url: string) {
        this.accessKey = key;
        this.timestamp = new Date();
        this.url = url;
        this.openAi = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
    }

    private async makeCompletionRequest(prompt:string): Promise<string | null> {

        const completion = await this.openAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: `${prompt}`
                }
            ],
        });
        let response =  completion.choices[0].message.content;
        return response;

    }

    async createGenreList(prompt: string): Promise<string[]>{
        //const request = this.createCompletionRequest(prompt);
        const response =  await this.makeCompletionRequest(prompt);
        console.log("createGenreList in openaimodel");
        console.log(response);
        let genres: Array<string>;
        const arrayRegex = /\[(.*?)\]/;

        if (!response) {
            throw new Error("Invalid response from OpenAi");
        }

        genres = response.split(",").map(item => item.trim());

        return genres;
    }

    async generatePlaylistName(keyWords: string[]): Promise<string | null> {
        let prompt = "Come up with a creative playlist name for a playlist containing songs of the following genres. Try to fit the vibe that these descriptors give off. Return only your generated title as a string, with no extra words. Genres: ";
        if(keyWords.length == 0){
            return "";
        }
        prompt += keyWords[0];
        if(keyWords.length > 1) {
            keyWords.forEach((keyword: string) => {
                prompt += `, ${keyword}`;
            });
        }
        const response = await this.makeCompletionRequest(prompt);
        return response;

    }


}

export function initOpenAiModel(key: string, url: string): OpenAIModel {
    return new OpenAIModel(key, url);
}

export class SpotifyModel {
    private url: string;
    private accessKey: string;
    private timestamp: Date;

    private async fetchSpotifyApi(endpoint: string, method: string, body) {
        const res = await fetch(`${this.url}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${this.accessKey}`,
            },
            method,
            body: JSON.stringify(body)
        });
        return await res.json();
    } 

    /*
    constructor(clientID: string, clientSecret: string, url: string) {

        this.generateAccessKey(clientID, clientSecret).then((access_key) => {
            this.accessKey = access_key;
        })
        .catch(() => {
            this.accessKey = "";
            this.timestamp = new Date();
        });

    }*/

    constructor(accessKey: string, url: string) {
        this.accessKey = accessKey;
        this.url = url;
        console.log("Spotify Model constructed with key");
        console.log(this.accessKey);
    }

    
    generateAccessKey(clientID: string, clientSecret: string): Promise<string> {
        let request = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`
        }



        return typedFetch(this.url, isSpotifyAccessTokenResponse, request)
        .then((response) => {
            let now = new Date();
            this.timestamp = new Date(now.getTime() + response.expires_in);
            return response.access_token;
        });
    }

    searchGenre<T>(genre: string, validate: TypeGuard<T>): Promise<T> {
        console.log("searchGenre entered");
        let url = this.url + `v1/search?q=genre:${genre}&type=track`;
        let request = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessKey}`
                
            }
        }
        return typedFetch(url, validate, request);
    }

    async reSearch<T>(url: string, validate: TypeGuard<T>): Promise<T> {
        console.log(`reSearch(${url})`);
        let request = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessKey}`
                
            }
        }
        const newUrl = this.url + url;
        return typedFetch(newUrl, validate, request);
    }

    private parseArtistName(artist: string): string {
        artist.replaceAll(" ", "%20");
        return artist;
    }

    async getArtist(artist: string):Promise<SpotifyArtistObject> {
        console.log(`getArtist(${artist})`);
        
        const url = `v1/search?q=artist%3A${this.parseArtistName(artist)}&type=artist`;
        let search =  await this.reSearch(url, isSpotifyRealSearchResponse);
        let artists = search.artists;
        if(!artists) {
            throw new Error("No artists object in Search response");
        }
        console.log(artists);
        if(!isSpotifySearchResponse(artists)) {
            throw new Error("Invalid Search Response object");
        }
        if(artists.total < 1) {
            throw new Error("No artist of that name found");
        }
        const firstArtist = artists.items[0];
        if (isSpotifyArtistObject(firstArtist)) {
            return firstArtist;
        }
        throw new Error("Invalid artist type found");
        /*return this.reSearch(url)
        .then((search: SpotifySearchResponse) => {
            if(search.total < 1) {
                throw new Error("No artist of that name found");
            }
            const firstArtist = search.items[0];
            if (isSpotifyArtistObject(firstArtist)) {
                return firstArtist;
            }
            throw new Error("Invalid artist type found");
        }).catch((error) => {
            throw error;
        });*/
    }

    getGenresFromArtist(artist: SpotifyArtistObject): Array<string> {
        return artist.genres;
    }

    async getArtistGenres(artist: string):Promise<Array<string>> {
        console.log("getArtistGenres entered");
       try {
            const artistObj = await this.getArtist(artist);
            return artistObj.genres;
        } catch (error) {
            throw error;
        }
    }

    /*
    selectTracks(results: SpotifySearchResponse, tracks: number, popularity: number, explicit: boolean): Array<SongData> {
        let items = results.items;
        const total = results.total;


        let songs = new Array<SongData>();

        let counter = 0;
        let songsSeen = 0;

        while(counter < tracks && songsSeen < total) {
            items.forEach((item) => {
                if (!isSpotifyTrackObject(item)) {
                    throw new Error("Invalid Spotify Response, not a valid track object");
                }
                
                const pop = item.popularity;
                const ex = item.explicit;
                if(pop && pop >= popLow && pop <= popHigh && ex == explicit) {
                    const song = {
                        title: item.name,
                        artist: item.artists
                    }
                }
            })
        }


        return [];
    }*/

    searchGenreAndArtist(genre: string, artist: string): Promise<SpotifyRealSearchResponse> {
        let url = this.url + `/search?q=genre:${genre} artist:${artist}&type=track`;
        let request = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessKey}`
            }
        }
        return typedFetch(url, isSpotifyRealSearchResponse, request);
    }

    async getTrackFromSearch(search: SpotifySearchResponse, idx: number): Promise<SpotifyTrackObject | null>  {
        const numPage = search.limit;

        console.log("getTrackFromSearch entered");
        
        if (idx < numPage) {
            const track = search.items[idx];
            console.log("getTrackFromSearch track:");
            console.log(track);
            if(isSpotifyTrackObject(track)){
                return track;
            } else {
                console.log(search);
                throw new Error("Did not find a valid track object");
            }
        }  else {
            console.log("going to correct page");
            let offset = 0;
            while(idx > numPage) {
                offset++;
                idx -= numPage;
            }
            let oldUrl = search.href;
            const newUrl = oldUrl.replace("offset=0", `offset=${offset*numPage}`).replace(this.url, "");
            

            return this.reSearch(newUrl, isSpotifyRealSearchResponse)
            .then((response: SpotifyRealSearchResponse) => {
                const search2 = response.tracks;
                if(!search2) {
                    throw new Error("No tracks object in search2 response");
                }
                if(!isSpotifySearchResponse(search2)){
                    throw new Error("Tracks object invalid search response");
                }
                const track = search2.items[idx];
                if (isSpotifyTrackObject(track)) {
                    return track;
                } else {
                    console.log("did not find a valid track object");
                    return null;
                }
            }).catch((error) => {
                throw error;
            });
            //return await newSearch;
        }
    }

    private getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

    getRandomSongFromGenre(genre: string, explicit: boolean, popularity: number): Promise<SongData> {
        console.log("getRandomSongFromGenre entered");
        return this.searchGenre(genre, isSpotifyRealSearchResponse)
        .then((songs: SpotifyRealSearchResponse) => {
            let tracks = songs.tracks;
            if(!tracks) {
                throw new Error("No Tracks object in Search Response");
            }
            if(!isSpotifySearchResponse(tracks)) {
                throw new Error("Tracks object not a valid search response");
            }
            return this.getRandomSongFromSearch(tracks, explicit, popularity);
        });
    }

    async getRandomSongFromSearch(songs: SpotifySearchResponse, explicit: boolean, popularity: number): Promise<SongData> {
        let seenSongs = new Map<string, number>();
        
        
        const numSongs = songs.total;
        const chosenSong = this.getRandomInt(numSongs - 1);
        let track: SpotifyTrackObject | null;
        
        //track = await this.getTrackFromSearch(songs, chosenSong);

        /*
        if (!track) {
            throw new Error("No track found?");
        }*/

        var popHigh: number;
        var popLow: number;
        if (popularity == 1) {
            popLow = 80;
            popHigh = 100;
        } else if (popularity == 2) {
            popHigh = 79;
            popLow = 20;
        } else if (popularity == 3) {
            popHigh = 19;
            popLow = 0;
        } else {
            popHigh = 100;
            popLow = 0;
        }

        let title: string;
        let img: SpotifyImgObject;
        let artists: Array<string>;
        let pop: number;
        let ex: boolean;

        let song: SongData = {
            title: "",
            artists: [],
            img: {
                url: "",
                height: 0,
                width: 0
            }
        }

        do {
            const chosenSong = this.getRandomInt(numSongs);
            track = await this.getTrackFromSearch(songs, chosenSong);
            while(!track) {
                console.log("no track found?");
                track = await this.getTrackFromSearch(songs, this.getRandomInt(numSongs - 1));
            }
            if (!track) {
                throw new Error("No track found?");
            }
    
            pop = track.popularity;
            ex = track.explicit;

            title = track.name;
            img = this.getImgFromTrack(track);
            artists = this.getArtistFromTrack(track);
            song = {
                title: title,
                artists: artists,
                img: img
            } as SongData;
            let numSeen = seenSongs.get(title);
            if (numSeen) {
                seenSongs.set(title, numSeen++);
                if (numSeen >= 5) {
                    throw new Error("Too few acceptable tracks, revisited song 5 times");
                }
            } else {
                seenSongs.set(title, 1);
            }
        } while (!(pop && pop >= popLow && pop <= popHigh) || (ex == true != explicit));

        return song;
    }

    async getNRandomSongsFromSearch(search: SpotifySearchResponse, numSongs: number, explicit: boolean, popularity: number): Promise<SongData[]> {
        if(search.total > numSongs) {
            throw new Error(`Cannot get ${numSongs} from search, only has ${search.total} items`);
        }


        let songs = new Map<string, SongData>();
        let newSongs =  new Array<SongData>();
        while(songs.keys.length < numSongs) {
            const song = await this.getRandomSongFromSearch(search, explicit, popularity);
            if (!(songs.get(song.title))) {
                {
                    songs.set(song.title, song);
                    newSongs.push(song);
                }

            }
        }
        return newSongs;
    }

    getRandomSongFromArtistGenre(genre: string, artist: string, explicit: boolean, popularity: number) {
        return this.searchGenreAndArtist(genre, artist)
        .then((songs: SpotifyRealSearchResponse) => {
            const tracks = songs.tracks;
            if(!tracks) {
                throw new Error("No tracks object in search response");
            }
            if(!isSpotifySearchResponse(tracks)) {
                throw new Error("Tracks object not a valid search response");
            }
            return this.getRandomSongFromSearch(tracks, explicit, popularity);
        })
    }

    getImgFromTrack(track: SpotifyTrackObject): SpotifyImgObject {
        const album = track.album;
        if (album && isSpotifyAlbumObject(album)) {
            const imgs = album.images;
            if (imgs) {
                imgs.forEach((img) => {
                    if(!isSpotifyImgObject(img)) {
                        throw new Error("Invalid image object");
                    }
                    if (img.height == 300 && img.width == 300) {
                        return img;
                    }
                });
                let img = imgs[0];
                if(!(isSpotifyImgObject(img))) {
                    throw new Error("invalid image object");
                }
                return img;
            }
        }
        const emptyImg = {
            url: "empty",
            width: 0,
            height: 0
        };
        return emptyImg;
    }

    getArtistFromTrack(track: SpotifyTrackObject): Array<string> {
        const artists = track.artists;
        if (!artists) {
            throw new Error("No artist data found for this track");
        }
        let artistNames = new Array<string>();
        artists.forEach((artistObj) => {
            if(!(isSpotifySimpleArtistObject(artistObj))) {
                throw new Error("Invalid Simple Artist Object");
            }
            artistNames.push(artistObj.name);
        });
        return artistNames;
    }


}

/*
export function initSpotifyModelGenerate(clientID: string, clientSecret: string, url: string): SpotifyModel {
    return new SpotifyModel(clientID, clientSecret, url);
}*/

export function initSpotifyModel(accessKey: string, url: string): SpotifyModel {
    return new SpotifyModel(accessKey, url);
}