/**
 * Identifies the unique set of data associated with a song's album image
 */
interface TrackImage {
    url: string;
    height: number;
    width: number;
}

/**
 * Identifies the unique set of data associated with any one song
 */
interface SongData {
    title: string;
    artists: string[];
    img: TrackImage;
}

/**
 * Gets a prewritten template for a specified component
 * @param id the id of the component the template is for
 * @returns an HTMLTemplateElement that provides the structure for this component
 */
function getTemplate1(id: string): HTMLTemplateElement {
    const template = document.querySelector(`#${id}-template`);
    if (!(template instanceof HTMLTemplateElement)) {
        throw new Error(`Template with id ${id} does not exist`);
    }
    return template;
}


/**
 * A custom component that has the necessary template of the prequiz.
 */
export class PreQuiz extends HTMLElement {
    
    private static template: HTMLTemplateElement;


    static initialize(id: string){
        PreQuiz.template = getTemplate1(id);
    }

    constructor() {
        super();
        this.append(PreQuiz.template.content.cloneNode(true));
        //this.append(struct.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

/**
 * A custom component that displays the necessary elements of a Question.
 */
export class Question extends HTMLElement {
    private static template: HTMLTemplateElement;

    static initialize() {
        Question.template = getTemplate1("question");

    }

    private controller: AbortController | null = null;
    private backBtn: HTMLButtonElement | null = null; 
    private nextBtn: HTMLButtonElement;

    private question: string;

    private answer: string;

    constructor() {
        super();

        const clone = Question.template.content.cloneNode(true);
        this.append(clone);
    }

    connectedCallback() {
        this.controller = new AbortController(); 
    }

    disconnectedCallback() {
        this.controller?.abort();
        this.controller = null;
    }

    setAnswer(answer: string) {
        this.answer = answer;
    }

    getAnswer(): string {
        return this.answer;
    }

    getQuestion(): string {
        return this.question;
    }

}

/**
 * A custom component that has the necessary template of a song item.
 * This component displays song information such as song title, artist, and 
 * album image to the user.
 */
export class SongItem extends HTMLElement {
    private static template: HTMLTemplateElement;

    static initialize(id: string) {
        SongItem.template = getTemplate1(id);
    }

    private controller: AbortController | null = null;

    private songName: string; // the title of the song
    private artistName: string; // the name of the song's artist(s)
    private imgLink: string; // the link to the song's album image

    constructor(songName: string, artists: string[], img: TrackImage) {
        super();
        this.songName = songName;
        this.imgLink = img.url;

        this.append(SongItem.template.content.cloneNode(true));

        const imgElem = this.querySelector(".song-img");
        if(!(imgElem instanceof HTMLImageElement)) {
            throw new Error("Image Element does not exist in SongItem template");
        }
        const titleElem = this.querySelector(".song-title");
        if(!(titleElem instanceof HTMLParagraphElement)) {
            throw new Error("Title paragraph element does not exist in SongItem template");
        }
        const artistElem = this.querySelector(".artist-name");
        if(!(artistElem instanceof HTMLParagraphElement)) {
            throw new Error("Artist paragraph element does not exist in SongItem template");
        }

        imgElem.src = this.imgLink;
        titleElem.innerText = songName;
        
        artistElem.innerText = artists[0];
        if (artists.length > 1) {
            artists.slice(1, artists.length).forEach((artist: string) => {
                artistElem.innerText += `, ${artist}`;
            });
        }

    }

    connectedCallBack() {
        this.controller = new AbortController();
    }

    disconnectedCallback() {
        this.controller?.abort();
    }
}


/**
 * Initialize the custom components
 */
export function initComponents() {
    PreQuiz.initialize("prequiz-start");

    Question.initialize();

    SongItem.initialize("song-item");



    customElements.define("pre-quiz", PreQuiz);

    customElements.define("quiz-question", Question);

    customElements.define("song-item", SongItem);
}

/**
 * Allow reinitialization of the PreQuiz to use a different starting template.
 * @param id the id of the template to be used
 */
export function reInitPreQuiz(id: string) {
    PreQuiz.initialize(id);
}

