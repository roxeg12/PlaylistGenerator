// An interface for an API request
interface Request {
    method?: string;
    headers: {
      [x: string]: string;
      Authorization: string;
    };
    body?: string;
}

class SpotifyModel {
    private accessKey: string;
    private timestamp: Date;

    constructor(key: string) {

        this.accessKey = key;
        this.timestamp = new Date();
    }


}

export function initSpotifyModel(key: string): SpotifyModel {
    return new SpotifyModel(key);
}