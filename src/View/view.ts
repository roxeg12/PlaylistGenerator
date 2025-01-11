import {Question, SongItem} from "../components";

/**
 * The QuestionData interface serves to identify the type of mapping that
 * contains the necessary info about a question
 */
interface QuestionData {
    id: string; // unique, how the question is referred to across the app
    question: string; // the actual question displayed to the user
    type: string; // possible options: oe (open-ended), mc (multiple-choice), cb (checkboxes)
    answerChoices: string; // to be written as HTML
}

/**
 * Identifies the detail for the custom event dispatched when the prequiz is submitted
 */
interface submitPrequizEventDetail {
    quizLength: string, // the user chosen length of the actual quiz
    answers: Map<string, string> // the prequiz answers
}

 /**
  * Identifies the detail for the custom event dispatched when the quiz is submitted
  */
interface submitQuizEventDetail {
    answers: Map<string, string> // the quiz answers
}

interface TrackImage {
    url: string;
    height: number;
    width: number;
}

interface SongData {
    title: string;
    artists: string[];
    img: TrackImage;
}

/**
 * The View class that handles all quiz functionality, including switching out questions,
 * (displaying a new question or redisplaying an old one), saving user input, and sending a submission
 * event when the user has completed the specified questions
 */
export class PreQuizView {

    private type: string; // should be either prequiz or quiz

    private startQuizBtn: HTMLButtonElement; // starts the quiz

    private prequizSection: HTMLElement; // the section in which the prequiz will occur

    private Questions: Array<QuestionData>; // the questions for the user to answer

    private Answers: Map<string, string>; // a map of each question ID to the user input answer

    private currQ: QuestionData; // the question currently displayed to the user

    private countQ: number; // the index of currQ in Questions

    private question: HTMLElement; // the heading element where the question's text is displayed
    private answerArea: HTMLElement; // the section element where the question's answer choices/input boxes are displayed
    private backBtn: HTMLButtonElement; // the button that allows the user to return to a previous question

    // takes the associated questions, and the type of quiz as input
    constructor(questions: Array<QuestionData>, type: string) {
        this.Questions = questions;
        this.type = type;

        let answers = new Map<string, string>();
        this.Answers = answers;

        const startBtn = document.querySelector("#start-prequiz-btn");
        if(!(startBtn instanceof HTMLButtonElement)) {
            throw new Error("Prequiz not in document: no start button");
        }
        this.startQuizBtn = startBtn;
        this.startQuizBtn.addEventListener("click", this.startQuiz.bind(this));
    }

    /**
     * Begins the quiz. Transitions from the starting display to the first 
     * question of the quiz. Adds event listeners to back button and the currently
     * displayed Question's answer area, to allow for movement through the questions
     * by the user.
     */
    startQuiz() {
        // Find and remove prequiz
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

        // Begin questions
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

    /**
     * Determines the target of the click event, and if it is a button, calls nextQuestion
     * @param event a mouse event in the currently displayed Question's answer area
     * @param type the type of question being displayed
     */
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

    /**
     * Implements functionality of the buttons in the Question's answer area, allowing for the user 
     * to move to the next question by answering the current one. Differentiates between the different
     * types of question answer areas, and deals with each type appropriately.
     * Dispatches a submission event when the quiz reaches the last question.
     * @param answerBtn the button that was the target of a click event in the question's answer area
     */
    nextQuestion(answerBtn: HTMLButtonElement) {
        console.log("nextQuestion called");
        const qID = this.currQ.id;
        var answer = "";

        // Check for question type, deal with appropriately
        if(this.currQ.type == "mc") {
            // Multiple choice
            console.log("type mc");
            const dataAnswer = answerBtn.getAttribute("data-answer");
            if(!dataAnswer) {
                throw new Error(`No data-answer attribute on button ${answerBtn} on question ${this.currQ.id}`);
            }
            //answer = answerBtn.innerText;
            answer = dataAnswer;
        } else if (this.currQ.type == "cb"){
            // Checkboxes
            this.answerArea.addEventListener("click", (ev: MouseEvent) => {
                if(ev.target instanceof HTMLInputElement) {
                    this.removeErrorMessage();
                }
            })
            var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');
            if(checkedBoxes.length == 0) {
                this.displayErrorMessage("Choose at least one option.");
            }
            checkedBoxes.forEach((checkbox) => {
                if (!(checkbox instanceof HTMLInputElement)) {
                    throw new Error("Check box does not exist?");
                }
                const val = checkbox.value;
                answer += val + " ";
            });
            
        } else{
            // Open ended
            console.log("type oe");
            const input = this.answerArea.querySelector("input");
            if (!(input instanceof HTMLElement)) {
                throw new Error("Input does not exist for open ended question");
            }
            /*
            input.forEach((inputBox: HTMLInputElement) => {
                answer += `${inputBox.value} `;
            })*/


            input.addEventListener("keypress", () => {
                this.removeErrorMessage();
            });
           
            if (input.value == "") {

                this.displayErrorMessage("Enter an answer.");
                
            } else {
                answer = input.value;
            }
           
        }
        if(answer) {
            console.log("qID:", qID);
            console.log("answer:", answer);
            this.Answers.set(qID, answer);
            console.log("set answer in map")


            const qIdx = ++this.countQ;
            console.log("qIdx", qIdx);


            // display next question
            if(qIdx < this.Questions.length) {
                this.currQ = this.Questions[qIdx];
                console.log("currQ", JSON.stringify(this.currQ));
                this.question.innerText = this.currQ.question;
                this.answerArea.innerHTML = this.currQ.answerChoices;
            } else {
                /*
                this.question.innerText = "Answers:";
                for (let entry of this.Answers.entries()) {
                    this.answerArea.innerHTML= this.answerArea.innerText + `question: ${entry[0]}, answer: ${entry[1]}\n`
                }*/
            if (this.type == "prequiz") {
                    const quizLength = this.Answers.get("quiz-length");
                    if (!(quizLength)) {
                        throw new Error("User did not answer quiz length question");
                    }
                

                    const submitPrequizEvent = new CustomEvent<submitPrequizEventDetail>("submitPrequizEvent", 
                        {detail: {quizLength: quizLength, answers: this.Answers}});

                    document.dispatchEvent(submitPrequizEvent);
                    console.log("Prequiz submission event dispatched");
                } else {
                    console.log("nextQuestion");
                    console.log(this.Answers);
                    const submitQuizEvent = new CustomEvent<submitQuizEventDetail>("submitQuizEvent",
                        {detail: {answers: this.Answers}}
                    );
                    document.dispatchEvent(submitQuizEvent);
                    console.log("Quiz submission event dispatched");
                }
            }
        }
        
    }

    private displayErrorMessage(err: string) {
        const question  = document.querySelector("#answer-section");
        if(!(question instanceof HTMLElement)) {
            throw new Error("No Question element exists on document");
        }
        let errMsg = document.querySelector(".error-msg");
        if(!errMsg) {
            const errMsg = document.createElement("p");
            errMsg.className = "error-msg";
            errMsg.innerText = err;
            question.appendChild(errMsg);
        }
    }

    private removeErrorMessage() {
        const question  = document.querySelector("#answer-section");
        const err = document.querySelector(".error-msg");
            if((question instanceof HTMLElement) && (err instanceof HTMLParagraphElement)) {
                question.removeChild(err);
            }
    }

    /**
     * Removes the current question from display and redisplays the immediately
     * preceding question. To be called when the user presses the back button.
     */
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

export class PlaylistView {
    private PlaylistSection: HTMLElement; // a section element
    private songList: Array<Promise<SongData>>;
    private title: HTMLHeadingElement;

    constructor(playlistSection: HTMLElement, songList: Array<Promise<SongData>>) {
        this.PlaylistSection = playlistSection;
        this.PlaylistSection.id = "playlist-section";
        this.title = document.createElement("h2");
        this.title.id = "playlist-name";
        this.PlaylistSection.appendChild(this.title);
        this.songList = songList;
    }

    setTitle(title: string) {
        this.title.innerText = title;
    }

    async createPlaylist() {
        console.log("createPlaylist called in PlaylistView");
        this.songList.forEach(async (songP: Promise<SongData>) => {
            /*songP.then((song) => {
                const songElem = new SongItem(song.title, song.artists, song.img);
                this.PlaylistSection.appendChild(songElem);
            }).catch((error) => {
                console.log(error);
            });*/
            try {
                let song = await songP;
                const songElem = new SongItem(song.title, song.artists, song.img);
                this.PlaylistSection.appendChild(songElem);
            } catch (error){
                console.log(error);
            }

        });
        //document.dispatchEvent(new CustomEvent("completePlaylistEvent"));
    }
}

export class LoadingView {
    private section: HTMLElement;
    private text: HTMLHeadingElement;

    constructor(loadingSection: HTMLElement) {
        this.section = loadingSection;
        this.section.id = "loading-page";
        const h3 = document.createElement("h3");
        h3.innerText = "Your playist is generating...";
        this.section.appendChild(h3);
    }

    displayLoadingPage() {

    }
}

