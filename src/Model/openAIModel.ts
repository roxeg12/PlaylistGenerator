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

class OpenAIModel {
    private accessKey: string;
    private timestamp: Date;

    private url: string;

    constructor(key: string) {
        this.accessKey = key;
        this.timestamp = new Date();
        this.url = "https://api.openai.com/v1/chat/completions"
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
        return typedFetch(this.url, isGenreList, request);
    }


}

export function initOpenAiModel(key: string): OpenAIModel {
    return new OpenAIModel(key);
}

class SpotifyModel {
    private url: string;
    private accessKey: string;
    private timestamp: Date;

    constructor(clientID: string, clientSecret: string, url: string) {

        this.generateAccessKey(clientID, clientSecret).then((access_key) => {
            this.accessKey = access_key;
        })
        .catch(() => {
            this.accessKey = "";
            this.timestamp = new Date();
        });

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


}

export function initSpotifyModel(clientID: string, clientSecret: string, url: string): SpotifyModel {
    return new SpotifyModel(clientID, clientSecret, url);
}