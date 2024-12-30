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

        /*
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
        */

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
 * Initialize the custom components
 */
export function initComponents() {
    PreQuiz.initialize("prequiz-start");

    Question.initialize();

    customElements.define("pre-quiz", PreQuiz);

    customElements.define("quiz-question", Question);
}

/**
 * Allow reinitialization of the PreQuiz to use a different starting template.
 * @param id the id of the template to be used
 */
export function reInitPreQuiz(id: string) {
    PreQuiz.initialize(id);
}

