import type { JSONSchema } from "json-schema-to-ts";
import { FromSchema } from "json-schema-to-ts";
import { $Compiler, wrapCompilerAsTypeGuard } from "json-schema-to-ts";
import Ajv from "ajv";

// An interface for an API request
interface Request {
    method?: string;
    headers: {
      [x: string]: string;
      Authorization: string;
    };
    body?: string;
}

interface SongData {
    title: string;
    artist: string;
    imgLink: string;
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
    properties: {
        url: {type: "string"},
        height: {type: "number"},
        width: {type: "number"}
    },
    additionalProperties: false,
} as const satisfies JSONSchema;

export type SpotifyImgObject = FromSchema<typeof SpotifyImgObjectSchema>;

let isSpotifyImgObject = compile(SpotifyImgObjectSchema);

const SpotifyArtistObjectSchema = {
    $id: "spotify-artist.json",
    $schema: "http://json-schema.org/draft=07/schema",
    title: "SpotifyArtistObject",
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
                $ref: "spotify-img.json"
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
                $ref: "spotify-artist.json"
            }
        }
    }
} as const satisfies JSONSchema;

export type SpotifyAlbumObject = FromSchema<typeof SpotifyAlbumObjectSchema, {references: [typeof SpotifyImgObjectSchema, typeof SpotifyArtistObjectSchema]}>;

let isSpotifyAlbumObject = compile(SpotifyAlbumObjectSchema);

const SpotifyArtistArraySchema = {
    $id: "spotify-artist-array.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyArtistArray",
    type: "array",
    items: {
        $ref: "spotify-artist.json"
    }
} as const satisfies JSONSchema;

export type SpotifyArtistArray = FromSchema<typeof SpotifyArtistArraySchema, {references: [typeof SpotifyArtistObjectSchema]}>;

let isSpotifyArtistArray = compile(SpotifyArtistArraySchema);

const SpotifyTrackObjectSchema = {
    $id: "spotify-track.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifyTrackObject",
    type: "object",
    required: ["popularity", "name"],
    properties: {
        album: {
            $ref: "spotify-album.json"
        },
        artists: {
            type: "array",
            items: {
                $ref: "spotify-artist.json"
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

export type SpotifyTrackObject = FromSchema<typeof SpotifyTrackObjectSchema, {references: [typeof SpotifyAlbumObjectSchema, typeof SpotifyArtistObjectSchema, typeof SpotifyImgObjectSchema]}>;

let isSpotifyTrackObject = compile(SpotifyTrackObjectSchema);

const SpotifySearchResponseSchema = {
    $id: "search-response.json",
    $schema: "http://json-schema.org/draft-07/schema",
    title: "SpotifySearchResponse",
    type: "object",
    required: ["href", "limit", "next", "offset", "previous", "total", "items"],
    properties: {
        href: {type: "string"},
        limit: {type: "number"},
        next: {type: "string"},
        offset: {type: "number"},
        previous: {type: "string"},
        total: {type: "number"},
        items: {
            type: "array",

        }
    },
    additionalProperties: false
} as const satisfies JSONSchema;

export type SpotifySearchResponse = FromSchema<typeof SpotifySearchResponseSchema>;

let isSpotifySearchResponse = compile(SpotifySearchResponseSchema);


export function typedFetch<T>(
    url: string,
    validate: TypeGuard<T>,
    options?: RequestInit,
  ): Promise<T> {
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

    constructor(key: string, url: string) {
        this.accessKey = key;
        this.timestamp = new Date();
        this.url = url;
    }

    private createCompletionRequest(prompt:string): Request {

        let request = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.accessKey}`
            },
            body: `
            {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": "${prompt}"
                    }
                ]
            }
            `
        }
        return request;

    }

    createGenreList(prompt: string): Promise<GenreList>{
        const request = this.createCompletionRequest(prompt);
        return typedFetch(this.url, isOpenAIResponse, request)
        .then((response) => {
            const genres = response.choices[0].message?.content;
            if(isGenreList(genres)){
                return genres;
            } else {
                return [];
            }
        });
    }


}

export function initOpenAiModel(key: string, url: string): OpenAIModel {
    return new OpenAIModel(key, url);
}

export class SpotifyModel {
    private url: string;
    private accessKey: string;
    private timestamp: Date;

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

    searchGenre(genre: string): Promise<SpotifySearchResponse> {
        let url = this.url + `/search?q=genre:${genre}&type=track`;
        let request = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessKey}`
            }
        }
        return typedFetch(url, isSpotifySearchResponse, request);
    }

    reSearch(url: string): Promise<SpotifySearchResponse> {
        let request = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessKey}`
            }
        }
        return typedFetch(url, isSpotifySearchResponse, request);
    }

    selectTracks(results: SpotifySearchResponse, tracks: number, popularity: number, explicit: boolean): Array<SongData> {
        let items = results.items;
        const total = results.total;
        var popHigh: number;
        var popLow: number;
        if (popularity == 1) {
            popLow = 80;
            popHigh = 100;
        } else if (popularity == 2) {
            popHigh = 79;
            popLow = 20;
        } else {
            popHigh = 19;
            popLow = 0;
        }

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
    }

    searchGenreAndArtist(genre: string, artist: string): Promise<SpotifySearchResponse> {
        let url = this.url + `/search?q=genre:${genre} artist:${artist}&type=track`;
        let request = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessKey}`
            }
        }
        return typedFetch(url, isSpotifySearchResponse, request);
    }


}

/*
export function initSpotifyModelGenerate(clientID: string, clientSecret: string, url: string): SpotifyModel {
    return new SpotifyModel(clientID, clientSecret, url);
}*/

export function initSpotifyModel(accessKey: string, url: string): SpotifyModel {
    return new SpotifyModel(accessKey, url);
}