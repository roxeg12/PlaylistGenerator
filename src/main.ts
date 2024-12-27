import {initComponents, PreQuiz} from "./components";
import {PreQuizView} from "./View/view";
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

    

    const prequizQs = new Array<string>("vibe-calibration", "age-rating", "popularity", "playlist-length");
    const prequiz = new PreQuiz();
    main.append(prequiz);
    //homeDisplay.replaceWith(prequiz);
    const pqView = new PreQuizView(prequizQs);


    
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});