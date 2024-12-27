function getTemplate1(id: string): HTMLTemplateElement {
    const template = document.querySelector(`#${id}-template`);
    if (!(template instanceof HTMLTemplateElement)) {
        throw new Error(`Template with id ${id} does not exist`);
    }
    return template;
}


export class PreQuiz extends HTMLElement {
    
    private static template: HTMLTemplateElement;

    static initialize(){
        PreQuiz.template = getTemplate1("prequiz-start");
    }

    constructor() {
        super();
        this.append(PreQuiz.template.content.cloneNode(true));

    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

export class Question extends HTMLElement {
    private template: HTMLTemplateElement;
    private controller: AbortController | null = null;

    private ID: string;

    private backBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement;

    private question: string;

    private answer: string;

    constructor(id: string) {
        super();

        this.ID = id;

        const template = getTemplate1(`${id}-template`);
        if(!(template instanceof HTMLTemplateElement)) {
            console.error(`Template for question ${id} does not exist`);
            throw new Error("Missing question template");
        }
        this.template = template;
        const clone = template.content.cloneNode(true);
        this.append(clone);

        const backBtn = this.querySelector(".back-btn");
        if(!(backBtn instanceof HTMLButtonElement)) {
            this.backBtn = null;
        } else {
            this.backBtn = backBtn;
        }

        const nextBtn = this.querySelector(".next-btn");
        if(!(nextBtn instanceof HTMLButtonElement)) {
            throw new Error("Question template incomplete: missing next button");
        }
        this.nextBtn = nextBtn;

        const question = this.querySelector("h3");
        if(!(question instanceof HTMLElement)) {
            throw new Error("Missing h3 element containing question");
        }
        this.question = question.innerText;

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

    getID() {
        return this.ID;
    }
}

export function initComponents() {
    PreQuiz.initialize();

    customElements.define("pre-quiz", PreQuiz);
    customElements.define("quiz-question", Question);
}

