import {Question} from "../components";

interface QuestionData {
    id: string;
    question: string;
    type: string; // possible options: oe (open-ended) or mc (multiple-choice)
    answerChoices: string; // to be written as HTML
}



export class PreQuizView {


    private startQuizBtn: HTMLButtonElement;

    private Questions: Array<QuestionData>;

    private Answers: Map<string, string>; // a map of each question ID to the user input answer

    private currQ: QuestionData;

    private countQ: number;

    private question: HTMLElement;
    private answerArea: HTMLElement;
    private backBtn: HTMLButtonElement;

    constructor(questions: Array<QuestionData>) {
        
        this.Questions = questions;

        this.Answers = new Map<string, string>();

        const startBtn = document.querySelector("#start-prequiz-btn");
        if(!(startBtn instanceof HTMLButtonElement)) {
            throw new Error("Prequiz not in document: no start button");
        }
        this.startQuizBtn = startBtn;
        this.startQuizBtn.addEventListener("click", this.startQuiz.bind(this));
    }

    startQuiz() {
        const prequizSection = document.querySelector("#prequiz-start");
        if(!(prequizSection instanceof HTMLElement)) {
            throw new Error("Prequiz start section does not exist");
        }
        const prequizParent = prequizSection.parentElement;
        prequizParent?.removeChild(prequizSection);


        this.currQ = this.Questions[0];
        this.countQ = 0;

        //create the question area
        const qArea = new Question();
        prequizParent?.append(qArea);

        const question = qArea.querySelector("#question-string");
        if(!(question instanceof HTMLHeadingElement)) {
            throw new Error("Question heading element does not exist");
        }
        this.question = question;


        const answerArea = qArea.querySelector("#answer-section");
        if(!(answerArea instanceof HTMLElement)) {
            throw new Error("Answer section does not exist");
        }
        this.answerArea = answerArea;
        
        const backBtn = document.querySelector("back-btn");
        if(!(backBtn instanceof HTMLButtonElement)) {
            throw new Error("Question back button does not exist");
        }
        this.backBtn = backBtn;

        this.question.innerText = this.currQ.question;
        this.answerArea.innerHTML = this.currQ.answerChoices;
        this.backBtn.addEventListener("click", () => {
            prequizParent?.removeChild(qArea);
            prequizParent?.append(prequizSection);
        });

        this.answerArea.addEventListener("click", this.nextQuestion);
    }


    nextQuestion(event: MouseEvent) {
        const target = event.target;
        if (target instanceof HTMLElement) {
            const answerBtn = target.closest("button");
            if (answerBtn instanceof HTMLButtonElement) {
                const qID = this.currQ.id;
                const answer = answerBtn.innerText;
                this.Answers.set(qID, answer);

                const qIdx = this.countQ++;
                this.currQ = this.Questions[qIdx];

                // display next question
                if(qIdx < this.Questions.length) {
                    this.question.innerText = this.currQ.question;
                    this.answerArea.innerHTML = this.currQ.answerChoices;
                }
            }
        }
    }

    prevQuestion() {

        const qIdx = this.countQ--;
        this.currQ = this.Questions[qIdx];

        if(qIdx >= 0) {
            this.question.innerText = this.currQ.question;
            this.answerArea.innerHTML = this.currQ.answerChoices;
        } else {
            // show prequiz??
        }
        
    }


}