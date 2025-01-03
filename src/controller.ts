import { Question } from "./components";
import { OpenAIModel, SpotifyModel } from "./Model/model";

/**
 * A generic interface that represents an Answers map returned
 * by the quiz view, by any given length of quiz
 */
interface QuizAnswers {
    [x: string]: string;
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

interface SpotifyResponse {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Array<SpotifyResponse>
}

export class Controller {
    private AIModel: OpenAIModel;
    private SpotifyModel: SpotifyModel;
    
    constructor(aiModel: OpenAIModel, spotifyModel: SpotifyModel) {
        this.AIModel = aiModel;
        this.SpotifyModel = spotifyModel;
    }

    transitionToGenerate(pqAnswers: Map<string, string>, qAnswers: Map<string, string>) {
        console.log("transition to generate qAnswers");
        console.log(qAnswers);
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
    
        btn.addEventListener("click", () => this.generatePlaylist(pqAnswers, qAnswers));
    }

    generatePlaylist(pqAnswers: Map<string, string>, qAnswers: Map<string, string>) {
        console.log(`generatePlaylist qAnswers: `);
        console.log(qAnswers);
        console.log("pqAnswers: ");
        console.log(pqAnswers);
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
        const size = pqAnswers.get("quiz-length");
        if (!(size)) {
            throw new Error("Quiz size question does not exist in prequiz answers");
        } 
        let prompt: string;
        switch(size) {
            case 'Mini':
                prompt = this.createMiniPrompt(qAnswers);
                const response = this.AIModel.createGenreList(prompt)
                .then((response) => {
                    
                })
                break;
            default:
                prompt = "";
        }



        // Call openAI model with prompt to generate key words/ request info
        

        // call spotify API using keywords, return list of songs
    
        // Initialize playlist view, using song list
    
        // display playlist view
    }

    createMiniPrompt(qAnswers: Map<string, string>): string {
        console.log("createMiniPrompt");
        console.log(qAnswers);
        const vibeSet = qAnswers.get("playlist-vibe");
        if (!vibeSet) {
            throw new Error("vibeSet does not exist in quiz question answers");
        }
        console.log(`vibeSet: ${vibeSet}`);
        const vibes = vibeSet.split(" ");
    
        const artist = qAnswers.get("similar-artist");
        if (!artist && artist != "") {
            throw new Error("Artist does not exist in mini quiz question answers");
        }
    
        var dissimilar = qAnswers.get("dissimilar-song");
        if(!dissimilar && dissimilar != "") {
            throw new Error("dissimilar song and artist does not exist in mini quiz question answers");
        }
        var dissimilarList = dissimilar.split("by");
        if (dissimilar.length == 0) {
            dissimilarList = ["", ""];
        }
        const disSong = dissimilarList[0];
        const disArtist = dissimilarList[1];
    
        var string1 = `Give me a list of music genres that elicit the
        emotions or vibes listed below. Each vibe descriptor should be matched to at least one music genre, more if
        there is are strong enough associations. Return a list of ONLY music genres, separated by commas
        no more and no less. The descriptors: `
    
        vibes.forEach((vibe: string) => {
            string1 += `${vibe}, `;
        });
    
        return string1;   
    }


    createPlaylistMini(pqAnswers: Map<string,string>, genres: Array<string>, artist: string, disArtist: string, disSong: string) {
        const playlistLengthString = pqAnswers.get("playlist-length");
        if (!playlistLengthString) {
            throw new Error("No playlist length response in prequiz question answers");
        }
        const playlistLength = Number(playlistLengthString);
        let currLength = 0;



        while(currLength < playlistLength) {

        }
        
    }


}