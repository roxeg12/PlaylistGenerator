import {initComponents, PreQuiz, Question, reInitPreQuiz} from "./components";
import { Controller } from "./controller";
import { initOpenAiModel, initSpotifyModel, OpenAIModel } from "./Model/model";
import {PreQuizView} from "./View/view";

declare const process: {
    env: {
        OPEN_AI_ACCESS_KEY: string;
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        SPOTIFY_ACCESS_KEY: string;
    };
};

/**
 * The QuestionData interface serves to identify the type of mapping that
 * contains the necessary info about a question
 */
interface QuestionData {
    id: string;
    question: string;
    type: string; // possible options: oe (open-ended) or mc (multiple-choice)
    answerChoices: string; // to be written as HTML
}

/**
 * Identifies the detail for the custom event dispatched when a prequiz is submitted
 */
interface submitPrequizEventDetail {
    quizLength: string,
    answers: Map<string, string>
}

 /**
  * Identifies the detail for the custom event dispatched when the quiz is submitted
  */
 interface submitQuizEventDetail {
    answers: Map<string, string> // the quiz answers
}

 /**
  * Identifies the detail for the custom event dispatched when a quiz is submitted
  */
interface QuizAnswersEventDetail {
    pqAnswers: Map<string, string>,
    qAnswers: Map<string, string>
}

/**
 * A generic interface that represents an Answers map returned
 * by the quiz view, by any given length of quiz
 */
interface QuizAnswers {
    [x: string]: string
}

/**
 * An Answers map returned by the quiz view, contains all 
 * question IDs of a Mini length quiz
 */
interface MiniQuizAnswers extends QuizAnswers{
    "playist-vibe": string;
    "similar-artist": string;
    "dissimilar-song": string;
}

/**
 * An Answers map returned by the prequiz view, contains all question
 * IDs of the prequiz
 */
interface PreQuizAnswers {
    "age-rating": string;
    popularity: string;
    "playlist-length": string,
    "quiz-length": string
}

/**
 * The questions for the user to answer during the PreQuiz
 */
const PreQuizQuesions = new Array<QuestionData>(
    {
        id: "age-rating", 
        question: "Age rating?", 
        type: "mc", 
        answerChoices: `<ul>
                <li><button data-answer="clean">Keep it clean</button></li>
                <li><button data-answer="explicit">We can get explicit</button></li>
                </ul>`
    },
    /*
    {
        id: "popularity",
        question: "How cultured should this be?",
        type: "mc",
        answerChoices: `<ul>
                <li><button data-answer="1">Top hits only</button></li>
                <li><button data-answer="3">As niche as you can make it</button></li>
                <li><button data-answer="2">Somewhere in the middle</button></li>
                <li><button data-answer="4">Any!</button></li>
                </ul>`
    },*/
    {
        id: "playlist-length",
        question: "How long should the playlist be?",
        type: "oe",
        answerChoices: `<input type="text" name="playlist-length" id="playlist-length">
            <label for="playlist-length"> songs</label>
            <button>Submit</button>`
    },
    {
        id: "quiz-length",
        question: "Choose the length of your quiz",
        type: "mc",
        answerChoices: `
                <ul>
                    <li><button data-answer="Mini">Mini</button></li>
                </ul>
            `
    }
)

/**
 * The questions for the user to answer during a Mini Quiz
 */
const QuizQuestions = new Array<QuestionData>(
    {
        id: "playlist-vibe",
        question: "Pick some vibes for the playlist:",
        type: "cb",
        answerChoices: `<input type="checkbox" id="joyful" name="joyful" value="joyful">
                <label for="joyful">Joyful</label><br>

                <input type="checkbox" id="melancholic" name="melancholic" value="melancholic">
                <label for="melancholic">Melancholic</label><br>

                <input type="checkbox" id="upbeat" name="upbeat" value="upbeat">
                <label for="upbeat">Upbeat</label><br>

                <input type="checkbox" id="tranquil" name="tranquil" value="tranquil">
                <label for="tranquil">Tranquil</label><br>

                <input type="checkbox" id="groovy" name="groovy" value="groovy">
                <label for="groovy">Groovy</label><br>

                <input type="checkbox" id="hype" name="hype" value="hype">
                <label for="hype">Hype</label><br>

                <input type="checkbox" id="chill" name="chill" value="chill">
                <label for="chill">Chill</label><br>

                <input type="checkbox" id="aggressive" name="aggressive" value="aggressive">
                <label for="aggressive">Agressive</label><br>

                <input type="checkbox" id="yearning" name="yearning" value="yearning">
                <label for="yearning">Yearning</label><br>

                <input type="checkbox" id="heartfelt" name="heartfelt" value="heartfelt">
                <label for="heartfelt">Heartfelt</label><br>

                <input type="checkbox" id="grandiose" name="grandiose" value="grandiose">
                <label for="grandiose">Grandiose</label><br>

                <input type="checkbox" id="futuristic" name="futuristic" value="futuristic">
                <label for="futuristic">Futuristic</label><br>

                <input type="checkbox" id="edgy" name="edgy" value="edgy">
                <label for="edgy">Edgy</label><br>

                <input type="checkbox" id="whimsical" name="whimsical" value="whimsical">
                <label for="whimsical">Whimsical</label><br>

                <input type="checkbox" id="dramatic" name="dramatic" value="dramatic">
                <label for="dramatic">Dramatic</label><br>

                <button>Next</button>
        `
    },
    {
        id: "similar-artist",
        question: "Give me an artist that would fit in this playlist",
        type: "oe",
        answerChoices: `
            <input type="text" name="similar-artist">
            <button id="submit-btn">Submit</button>
        `
    },
    {
        id: "dissimilar-song",
        question: "Give me one song that should not be on this playlist",
        type: "oe",
        answerChoices: `
            <p>Name and artist!!</p>
            <input type="text">
            <button>Submit</button>
        `
    }

);

/**
 * Initializes components and necessary starting view, attaches beginning 
 * event listeners
 */
function main(): void {
    // initialize views and models
    const startBtn = document.querySelector("#start-quiz-btn");
    if(!(startBtn instanceof HTMLButtonElement)) {
        console.log("No start button exists");
        throw new Error("No start quiz button exists");
    }
    
    initComponents();

    const openAIkey = process.env.OPEN_AI_ACCESS_KEY;
    const openAIUrl = "https://api.openai.com/v1/chat/completions";

    const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const spotifyAccessKey = process.env.SPOTIFY_ACCESS_KEY;
    const SpotifyUrl = `https://api.spotify.com/`;

    const openAImodel = initOpenAiModel(openAIkey, openAIUrl);
    const spotifyModel = initSpotifyModel(spotifyAccessKey, SpotifyUrl);

    const controller = new Controller(openAImodel, spotifyModel);

        /**
     * Begins the prequiz. Replaces the default home display with the prequiz start display,
     * and initializes the quiz view
     * @returns void
     */
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

        

        const prequiz = new PreQuiz();
        main.append(prequiz);
        //homeDisplay.replaceWith(prequiz);
        const pqView = new PreQuizView(PreQuizQuesions, "prequiz");
    }

    /**
     * Begins the quiz. Replaces the prequiz view with the quiz view, and 
     * initializes the quiz view with the appropriate questions.
     * @param event a prequiz submission event
     */
    function startQuiz(event: Event) {
        console.log("start quiz function called in main.ts");
        const ev = event as CustomEvent<submitPrequizEventDetail>;
        const length = ev.detail.quizLength;
        const pqAnswers = ev.detail.answers;

        const main = document.querySelector("main");
        if (!(main instanceof HTMLElement)) {
            throw new Error("Main does not exist in document");
        }
        const question = document.querySelector("quiz-question");
        if(!(question instanceof Question)) {
            throw new Error("Question does not exist on page");
        }

        reInitPreQuiz("quiz-start");
        const quiz = new PreQuiz();

        main.removeChild(question);
        main.appendChild(quiz);
        var questions: QuestionData[];
        if(length == "Mini") {
            questions = QuizQuestions;
        } else {
            //CHANGE THIS FOR OTHER QUIZ SIZES
            questions = PreQuizQuesions;
        }
        const quizView = new PreQuizView(questions, "quiz");

        document.addEventListener("submitQuizEvent", (ev) => {
            const event = ev as CustomEvent<submitQuizEventDetail>;
            const qAnswers = event.detail.answers;
            console.log(`startQuiz qAnswers: `);
            console.log(qAnswers);
            controller.transitionToGenerate(pqAnswers, qAnswers);
        });

    }


    startBtn.addEventListener("click", startPreQuiz);
    
    document.addEventListener("submitPrequizEvent", startQuiz)
    
}

/**
 * Begins the prequiz. Replaces the default home display with the prequiz start display,
 * and initializes the quiz view
 * @returns void
 */
/*function startPreQuiz() {
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

    

    const prequiz = new PreQuiz();
    main.append(prequiz);
    //homeDisplay.replaceWith(prequiz);
    const pqView = new PreQuizView(PreQuizQuesions, "prequiz");
}*/

/**
 * Begins the quiz. Replaces the prequiz view with the quiz view, and 
 * initializes the quiz view with the appropriate questions.
 * @param event a prequiz submission event
 */
/*function startQuiz(event: Event) {
    console.log("start quiz function called in main.ts");
    const ev = event as CustomEvent<submitPrequizEventDetail>;
    const length = ev.detail.quizLength;
    const pqAnswers = ev.detail.answers;

    const main = document.querySelector("main");
    if (!(main instanceof HTMLElement)) {
        throw new Error("Main does not exist in document");
    }
    const question = document.querySelector("quiz-question");
    if(!(question instanceof Question)) {
        throw new Error("Question does not exist on page");
    }

    reInitPreQuiz("quiz-start");
    const quiz = new PreQuiz();

    main.removeChild(question);
    main.appendChild(quiz);
    var questions: QuestionData[];
    if(length == "Mini") {
        questions = QuizQuestions;
    } else {
        //CHANGE THIS FOR OTHER QUIZ SIZES
        questions = PreQuizQuesions;
    }
    const quizView = new PreQuizView(questions, "quiz");

    document.addEventListener("submitQuizEvent", (ev) => {
        const event = ev as CustomEvent<submitQuizEventDetail>;
        const qAnswers = event.detail.answers;
        transitionToGenerate(pqAnswers, qAnswers);
    });

}*/



/**
 * Displays a transition screen prompting the user to press a button to 
 * generate the playlist
 */
/*function transitionToGenerate(pqAnswers: Map<string, string>, qAnswers: Map<string, string>) {
    const main = document.querySelector("main");
    if (!(main instanceof HTMLElement)) {
        throw new Error("Main does not exist in document");
    }
    const question = document.querySelector("quiz-question");
    if(!(question instanceof Question)) {
        throw new Error("Question does not exist on page");
    }

    const section = document.createElement("section");
    section.id = "generate-transition";
    const heading = document.createElement("h3");
    heading.innerText = "Quiz Complete. Click to generate playlist";
    const btn = document.createElement("button");
    btn.innerText = "Generate";
    section.append(heading, btn);

    main.removeChild(question);
    main.appendChild(section);

    btn.addEventListener("click", () => generatePlaylist(pqAnswers, qAnswers));
}

function generatePlaylist(pqAnswers: Map<string, string>, qAnswers: Map<string, string>) {
    const main = document.querySelector("main");
    if (!(main instanceof HTMLElement)) {
        throw new Error("Main does not exist in document");
    }
    const transition = document.querySelector("#generate-transition");
    if(!(transition instanceof HTMLElement)) {
        throw new Error("Document does not have generation transition");
    }
    // replace in main with a loading page

    // Create prompt
    // Call openAI model with prompt to generate key words/ request info

    // call spotify API using keywords, return list of songs

    // Initialize playlist view, using song list

    // display playlist view
}*/

function createPrompt(pqAnswers: Map<string, string>, qAnswers: Map<string, string>, length: string ){
    switch(length) {
        case 'Mini':

    }
}

function createMiniPrompt(qAnswers: MiniQuizAnswers): string {
    const vibeSet = qAnswers["playist-vibe"];
    const vibes = vibeSet.split(" ");

    const artist = qAnswers["similar-artist"];

    var dissimilar = qAnswers["dissimilar-song"].split("by");
    if (dissimilar.length == 0) {
        dissimilar = ["", ""];
    }
    const disSong = dissimilar[0];
    const disArtist = dissimilar[1];

    var string1 = `Give me a list of music genres that elicit the
    emotions or vibes listed below. Each vibe descriptor should be matched to at least one music genre, more if
    there is are strong enough associations. Return a list of ONLY music genres, separated by commas
    no more and no less. The descriptors: `

    vibes.forEach((vibe: string) => {
        string1 += `${vibe}, `;
    });

    return string1;

    
}

/**
 * Ensures nothing is initialized until the DOM completely loads
 */
document.addEventListener("DOMContentLoaded", () => {
    main();
});