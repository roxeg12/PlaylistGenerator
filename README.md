<h1>VibeCheck</h1>
<p>an AI powered playlist generator</p>

<h2>Description:</h2>
<p>A web application that builds a playlist of song recommendations based on the user's preferred vibes for the playlist. The user completes a quiz to gather information about the desired vibe of their playlist, that the application uses to search for fitting Spotify tracks to recommend. These tracks are aggregated into a playlist of the indicated length.</p>

<h2>Tools:</h2>
<ul>
  <li>
    Languages:
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>TypeScript</li>
    </ul>
  </li>
  <li>
    APIs:
    <ul>
      <li>OpenAI</li>
      <li>Spotify</li>
    </ul>
  </li>
</ul>

<h2>Design:</h2>
<h3>MVC</h3>
<p>I made use of the Model-View-Controller design pattern to organize my code, and ensure decoupling and single responsibility.</p>
<ul>
  <li>
    <strong>Model:</strong>
    <p>
      The Model is responsible for all API calls, as well as response validation. For the most part, organization of responses was left to the controller, but the Model does have some functions such as 
      getRandomSongFromGenre and getRandomSongFromArtistGenre, that make similar API calls but with different (quantity and types of) inputs. This distinction is made within the Model to assist with response validation against the given schemas.
    </p>
    <em>Files:</em>
    <ul>
      <li><code>model.ts</code>: holds both SpotifyModel and OpenAIModel classes</li>
    </ul>
  </li>
  <li>
    <strong>View:</strong>
    <p>
      The View is responsible for most of the user interface changes. It utilizes both existing HTMLElements as well as my own custom elements to move, add, delete, and change components of the UI. This is where any event listeners are placed, to listen for interaction from the user, and call the appropriate actions in response.
    </p>
    <em>Files:</em>
    <ul>
      <li><code>view.ts</code>: holds both the quiz view (named PreQuizView but used for any series of questions) and the PlaylistView that displays the results of the program to the user</li>
      <li><code>components.ts</code>: holds the code for my custom elements</li>
    </ul>
  </li>
  <li>
    <strong>Controller:</strong> 
    <p>
      The Controller is responsible for facilitating communication between the Model and View, ensuring organized control flow throughout the quizzes, feeding in the correct questions to be added, and supplying the user's responses to the quiz questions to the models for appropriate calls, before finally generating the resulting playlist view with the model responses.
    </p>
    <em>Files:</em>
    <ul>
      <li><code>main.ts</code>: holds mostly instantiation and initialization of the components necessary for the program to begin</li>
      <li><code>controller.ts</code>: holds functions that will be called as the user progresses through the application.</li>
    </ul>
  </li>
</ul>
<h2>Skills utilized:</h2>
<h2>Future changes:</h2>
<ul>
  <li>
    <strong>Authorization:</strong>
    <p>Will implement oAuth2.0 so that the user can log in with their Spotify Account, and directly add the generated playlist to their library.</p>
  </li>
  <li>
    <strong>Recommendation Algorithm:</strong>
    <p>
      Unfortunately, the recommendation API endpoint that I initially planned to use when brainstorming this project has since been deprecated, so the current algorithm used to 
      choose songs is rudimentary.
    </p>
    <p>
      I eventually want to make use of the similar artists endpoint in combination with the genre generation that I currently have implemented. I plan to search those similar artists for tracks of the 
      generated genres, to create a more curated list of songs for the user.
    </p>
  </li>
</ul>
<h2>Demo:</h2>
<p>The following items are necessary:</p>
<ul>
  <li>node.js</li>
  <li>A spotify account</li>
  <li>A Spotify client ID</li>
  <li>A Spotify client secret</li>
  <li>An OpenAI access key</li>
</ul>
<p>Currently to run this code, complete the following steps:</p>
<ol>
  <li>Use the Spotify API and the client ID and client secret codes to generate a Spotify Access Key</li>
  <li>Fill in the provided .env file with the appropriate access keys</li>
  <li>Run <code>npm init</code> in the terminal</li>
  <li>Ensure that node is set up correctly, then run <code>npm start</code></li>
  <li>Follow the provided local link and fill out the quiz!</li>
</ol>

