import {Question} from "../components";



export class PreQuizView {


    private startQuiz: HTMLButtonElement;

    private Questions: Array<Question>;

    private Answers: Map<string, string>; // a map of each question ID to the user input answer

    private currQ: Question;

    private countQ: number;

    constructor(questionIDs: Array<string>) {
        this.Questions = new Array<Question>();
        questionIDs.forEach((question: string) => (
            this.Questions.push(new Question(question))
        ));

        this.Answers = new Map<string, string>();

        const startBtn = document.querySelector("#start-prequiz-btn");
        if(!(startBtn instanceof HTMLButtonElement)) {
            throw new Error("Prequiz not in document: no start button");
        }
        this.startQuiz = startBtn;

        this.currQ = this.Questions[0];

        this.countQ = 0;
    }

    nextQuestion() {
        const qID = this.currQ.getID();
        const answer = this.currQ.getAnswer();
        this.Answers.set(qID, answer);

        const qIdx = this.countQ++;

        if(qIdx < this.Questions.length){
            this.currQ.style.display = "none";
            this.currQ = this.Questions[qIdx];
            const newQ = document.querySelector(`#${this.currQ.getID()}`);
            if (!(newQ instanceof Question)){
                document.append(this.currQ);
            } else {
                newQ.style.display = "flex";
            }

        } else {
            // end of Prequiz?
        }
    }

    prevQuestion() {
        this.currQ.style.display = "none";

        const qIdx = this.countQ--;
        this.currQ = this.Questions[qIdx];

        const newQ = document.querySelector(`#${this.currQ.getID()}`);
        if (!(newQ instanceof Question)){
            document.append(this.currQ);
        } else {
            newQ.style.display = "flex";
        }
        
    }


}