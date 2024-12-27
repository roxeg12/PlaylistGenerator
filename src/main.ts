import {initComponents, PreQuiz} from "./components";
import {PreQuizView} from "./View/view";

interface QuestionData {
    id: string;
    question: string;
    type: string; // possible options: oe (open-ended) or mc (multiple-choice)
    answerChoices: string; // to be written as HTML
}

const PreQuizQuesions = new Array<QuestionData>(
    {
        id: "age-rating", 
        question: "Age rating?", 
        type: "mc", 
        answerChoices: `<ul>
                <li><button>Keep it clean</button></li>
                <li><button>We can get explicit</button></li>
                </ul>`
    },
    {
        id: "popularity",
        question: "How cultured should this be?",
        type: "mc",
        answerChoices: `<ul>
                <li><button>Top hits only</button></li>
                <li><button>As niche as you can make it</button></li>
                <li><button>Somewhere in the middle</button></li>
                <li><button>Any!</button></li>
                </ul>`
    },
    {
        id: "playlist-length",
        question: "How long should the playlist be?",
        type: "oe",
        answerChoices: `<input type="text" id="playlist-length">
            <select id="length-unit-select">
                <option value="minutes">Minutes</option>
                <option value="songs">Songs</option>
            </select>`
    }
)

function main(): void {
    // initialize views and models
    const startBtn = document.querySelector("#start-quiz-btn");
    if(!(startBtn instanceof HTMLButtonElement)) {
        console.log("No start button exists");
        throw new Error("No start quiz button exists");
    }
    
    initComponents();

    startBtn.addEventListener("click", startPreQuiz);

    
}

function startPreQuiz() {
    // remove stuff on home screen
    // display first question
    const homeDisplay = document.querySelector("#home-display");
    if(!(homeDisplay instanceof HTMLElement)) {
        console.log("Home display does not exist on page");
        window.location.reload();
        return;
    }

    const main = document.querySelector("main");
    if (!(main instanceof HTMLElement)) {
        throw new Error("Main content area does not exist in html");
    }
    main.removeChild(homeDisplay);
    //homeDisplay.style.display = "none";

    

    //const prequizQs = new Array<string>("vibe-calibration", "age-rating", "popularity", "playlist-length");
    const prequiz = new PreQuiz();
    main.append(prequiz);
    //homeDisplay.replaceWith(prequiz);
    const pqView = new PreQuizView(PreQuizQuesions);


    
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});