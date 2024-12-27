class OpenAIModel {
    private accessKey: string;
    private timestamp: Date;

    constructor(key: string) {
        this.accessKey = key;
        this.timestamp = new Date();
    }
}

export function initOpenAiModel(key: string): OpenAIModel {
    return new OpenAIModel(key);
}