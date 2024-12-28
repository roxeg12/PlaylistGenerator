import {Question} from "../components";

interface QuestionData {
    id: string;
    question: string;
    type: string; // possible options: oe (open-ended) or mc (multiple-choice)
    answerChoices: string; // to be written as HTML
}



export class PreQuizView {


    private startQuizBtn: HTMLButtonElement;

    private prequizSection: HTMLElement;

    private Questions: Array<QuestionData>;

    private Answers: Map<string, string>; // a map of each question ID to the user input answer

    private currQ: QuestionData;

    private countQ: number;

    private question: HTMLElement;
    private answerArea: HTMLElement;
    private backBtn: HTMLButtonElement;

    constructor(questions: Array<QuestionData>) {
        this.Questions = questions;

        let answers = new Map<string, string>();
        this.Answers = answers;

        const startBtn = document.querySelector("#start-prequiz-btn");
        if(!(startBtn instanceof HTMLButtonElement)) {
            throw new Error("Prequiz not in document: no start button");
        }
        this.startQuizBtn = startBtn;
        this.startQuizBtn.addEventListener("click", this.startQuiz.bind(this));
    }

    startQuiz() {
        const prequizSection = document.querySelector("pre-quiz");
        if(!(prequizSection instanceof HTMLElement)) {
            throw new Error("Prequiz start section does not exist");
        }
        this.prequizSection = prequizSection;
        const prequizParent = document.querySelector("main");
        if (!(prequizParent instanceof HTMLElement)) {
            throw new Error("Main does not exist in document");
        }
        prequizParent.removeChild(prequizSection);


        this.currQ = this.Questions[0];
        console.log(JSON.stringify(this.currQ));
        this.countQ = 0;

        //create the question area
        const qArea = new Question();
        prequizParent.appendChild(qArea);

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
        
        const backBtn = document.querySelector("#back-btn");
        if(!(backBtn instanceof HTMLButtonElement)) {
            throw new Error("Question back button does not exist");
        }
        this.backBtn = backBtn;

        this.question.innerText = this.currQ.question;
        this.answerArea.innerHTML = this.currQ.answerChoices;
        this.backBtn.addEventListener("click", this.prevQuestion.bind(this));

        this.answerArea.addEventListener("click", (ev) => {
            this.nextQuestionClick(ev, this.currQ.type)
        });
    }


    nextQuestionClick(event: MouseEvent, type: string) {
        const target = event.target;
        if (target instanceof HTMLElement) {
            const answerBtn = target.closest("button");
            if (answerBtn instanceof HTMLButtonElement) {
                console.log(type);
                this.nextQuestion(answerBtn);
            }
        }
    }

    nextQuestion(answerBtn: HTMLButtonElement) {
        console.log("nextQuestion called");
        const qID = this.currQ.id;
        var answer: string;
        if(this.currQ.type == "mc") {
            console.log("type mc");
            answer = answerBtn.innerText;
        } else{
            console.log("type oe");
            const input = this.answerArea.querySelector("input");
            if (!(input instanceof HTMLElement)) {
                throw new Error("Input does not exist for open ended question");
            }
            answer = input.value;
        }
        console.log("qID:", qID);
        console.log("answer:", answer);
        this.Answers.set(qID, answer);
        console.log("set answer in map")


        const qIdx = ++this.countQ;
        console.log("qIdx", qIdx);
        this.currQ = this.Questions[qIdx];
        console.log("currQ", JSON.stringify(this.currQ));

        // display next question
        if(qIdx < this.Questions.length) {
            this.question.innerText = this.currQ.question;
            this.answerArea.innerHTML = this.currQ.answerChoices;
        } else {
            this.question.innerText = "Answers:";
            for (let entry of this.Answers.entries()) {
                this.answerArea.innerHTML= this.answerArea.innerText + `question: ${entry[0]}, answer: ${entry[1]}\n`
            }
        }
    }

    prevQuestion() {

        const qIdx = --this.countQ;
        this.currQ = this.Questions[qIdx];

        if(qIdx >= 0) {
            this.question.innerText = this.currQ.question;
            this.answerArea.innerHTML = this.currQ.answerChoices;
        } else {
            // show prequiz??

            const prequizParent = document.querySelector("main");
            if (!(prequizParent instanceof HTMLElement)) {
                throw new Error("Main does not exist in document");
            }
            const qArea = document.querySelector("quiz-question");
            if(!(qArea instanceof Question)) {
                throw new Error("Question area does not exist in document");
            }
            prequizParent.removeChild(qArea);
            prequizParent.append(this.prequizSection);
        }
        
    }

    getAnswers(): Map<string, string> {
        return this.Answers;
    }


}

