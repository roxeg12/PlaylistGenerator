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