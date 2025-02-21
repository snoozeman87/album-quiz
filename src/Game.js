import React, { useState, useEffect, useCallback } from "react";
import "./Game.css"; // For styling

// Array of albums for the daily game
const albums = [
  { name: "Abbey Road", artist: "The Beatles", image: "/abbey_road.png" },
  { name: "The Dark Side of the Moon", artist: "Pink Floyd", image: "/dark-side-of-the-moon.jpg" },
  { name: "Nevermind", artist: "Nirvana", image: "/nevermind.jpg" },
  { name: "Drunk", artist: "Thundercat", image: "/Drunk.jpg" },
  { name: "Siamese Dream", artist: "The Smashing Pumpkins", image: "/Siamese Dream.jpeg" },
  { name: "Parachutes", artist: "Coldplay", image: "/Parachutes.jpg" },
  { name: "Ramones", artist: "Ramones", image: "/Ramones.jpg" },
  { name: "Straight Outta Compton", artist: "N.W.A", image: "/Straight Outta Compton.jpg" },
  { name: "This Is All Yours", artist: "Alt-J", image: "/This Is All Yours.jpg" },
  { name: "Kiwanuka", artist: "Michael Kiwanuka", image: "/Kiwanuka.jpg" },
  { name: "Jazz", artist: "Queen", image: "/Jazz.jpg" },
  { name: "Loveless", artist: "My Bloody Valentine", image: "/Loveless.jpg" },
  { name: "After Hours", artist: "The Weeknd", image: "/After Hours.jpg" },
  { name: "Blurryface", artist: "Twenty One Pilots", image: "/Blurryface.jpg" },
  { name: "Oracular Spectacular", artist: "MGMT", image: "/Oracular Spectacular.jpg" },
  { name: "American Teen", artist: "Khalid", image: "/American Teen.jpg" },
  { name: "Room On Fire", artist: "The Strokes", image: "/Room On Fire.jpg" },
  { name: "The 1975", artist: "The 1975", image: "/The 1975.jpg" },
  { name: "Elephant", artist: "The White Stripes", image: "/Elephant.jpg" },
  { name: "Automatic For The People", artist: "R.E.M.", image: "/Automatic For The People.jpg" },
  { name: "Foo Fighters", artist: "Foo Fighters", image: "/Foo Fighters.jpg" },
  { name: "Moving Pictures", artist: "Rush", image: "/Moving Pictures.jpg" },
  { name: "Daydream Nation", artist: "Sonic Youth", image: "/Daydream Nation.jpg" },
  { name: "Out Of The Blue", artist: "Electric Light Orchestra", image: "/Out Of The Blue.jpg" },
  { name: "Vampire Weekend", artist: "Vampire Weekend", image: "/Vampire Weekend.jpg" },
  { name: "Superunknown", artist: "Soundgarden", image: "/Superunknown.jpg" },
  { name: "Master Of Puppets", artist: "Metallica", image: "/Master Of Puppets.jpg" },
  { name: "Paranoid", artist: "Black Sabbath", image: "/Paranoid.jpg" },
  { name: "Californication", artist: "Red Hot Chili Peppers", image: "/Californication.jpg" },
  { name: "Who's Next", artist: "The Who", image: "/Who's Next.jpg" },
  { name: "A Rush Of Blood To The Head", artist: "Coldplay", image: "/A Rush Of Blood To The Head.jpg" },
  { name: "Songs For The Deaf", artist: "Queens of the Stone Age", image: "/Songs For The Deaf.jpg" },
  { name: "News Of The World", artist: "Queen", image: "/News Of The World.jpg" },
  { name: "OK Computer", artist: "Radiohead", image: "/OK Computer.jpg" },
  { name: "London Calling", artist: "The Clash", image: "/London Calling.jpg" },
  { name: "Tracy Chapman", artist: "Tracy Chapman", image: "/Tracy Chapman.jpg" },
  { name: "Hybrid Theory", artist: "Linkin Park", image: "/Hybrid Theory.jpg" },
  { name: "XX", artist: "The XX", image: "/XX.jpg" },
  { name: "Sigh No More", artist: "Mumford & Sons", image: "/Sigh No More.jpg" },
  { name: "Appetite For Destruction", artist: "Guns N' Roses", image: "/Appetite For Destruction.jpg" },
  { name: "Dire Straits", artist: "Dire Straits", image: "/Dire Straits.jpg" },
  { name: "Hot Fuss", artist: "The Killers", image: "/Hot Fuss.jpg" },
  { name: "El Camino", artist: "The Black Keys", image: "/El Camino.jpg" },
  { name: "Gorillaz", artist: "Gorillaz", image: "/Gorillaz.jpg" },
  { name: "Toys In The Attic", artist: "Aerosmith", image: "/Toys In The Attic.jpg" },
  { name: "Happier Than Ever", artist: "Billie Eilish", image: "/Happier Than Ever.jpg" },
  { name: "Animals", artist: "Pink Floyd", image: "/Animals.jpg" },
  { name: "Tattoo You", artist: "The Rolling Stones", image: "/Tattoo You.jpg" },
  { name: "Dummy", artist: "Portishead", image: "/Dummy.jpg" },
  { name: "Currents", artist: "Tame Impala", image: "/Currents.jpeg" },
  { name: "Awaken, My Love!", artist: "Childish Gambino", image: "/Awaken, My Love!.jpg" },
  { name: "Dirt", artist: "Alice In Chains", image: "/Dirt.jpg" },
  { name: "Born To Die", artist: "Lana Del Rey", image: "/Born To Die.jpg" },
  { name: "Lemonade", artist: "Beyoncé", image: "/Lemonade.jpg" },
  { name: "Divide", artist: "Ed Sheeran", image: "/Divide.jpg" },
  { name: "Back To Black", artist: "Amy Winehouse", image: "/Back To Black.jpg" },
  { name: "21", artist: "Adele", image: "/21.jpg" },
  { name: "Holy Fire", artist: "Foals", image: "/Holy Fire.jpg" },
  { name: "Midnights", artist: "Taylor Swift", image: "/Midnights.png" },
  { name: "Midnight Memories", artist: "One Direction", image: "/Midnight Memories.jpg" },
  { name: "Silent Alarm", artist: "Bloc Party", image: "/Silent Alarm.jpg" }
];

const getDailyAlbum = () => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24));
  const albumIndex = dayOfYear % albums.length;
  return albums[albumIndex];
};

const hasNewDayStarted = () => {
  const lastPlayedDate = localStorage.getItem("lastPlayedDate");
  const currentDate = new Date();
  const ukTime = new Date(currentDate.toLocaleString("en-GB", { timeZone: "Europe/London" }));
  return !lastPlayedDate || new Date(lastPlayedDate).toDateString() !== ukTime.toDateString();
};

const MAX_ATTEMPTS = 5;

const Game = () => {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);

  const album = getDailyAlbum();
  const pixelationLevels = [50, 33, 22, 11, 4, 0];

  const handleGuess = useCallback((manualGuess = guess) => {
    if (gameOver) return;

    const trimmedGuess = manualGuess.trim();
    if (trimmedGuess.toLowerCase() === album.name.toLowerCase()) {
      setWon(true);
      setGameOver(true);
    } else {
      setAttempts((prev) => prev + 1);
      setIncorrectGuesses((prev) => [...prev, trimmedGuess === "" ? "SKIPPED" : trimmedGuess]);

      if (attempts + 1 >= MAX_ATTEMPTS) {
        setGameOver(true);
      }
    }
    setGuess("");
  }, [guess, gameOver, attempts, album.name]);

  useEffect(() => {
    if (hasNewDayStarted()) {
      setAttempts(0);
      setGameOver(false);
      setWon(false);
      setIncorrectGuesses([]);
      localStorage.setItem("lastPlayedDate", new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }));
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleGuess();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleGuess]);

  return (
    <div className="game-box">
      <h1>Guess the Album Cover</h1>
      <p className="attempts">Attempts left: {MAX_ATTEMPTS - attempts}</p>
  
      <div className="album-container">
        <img
          src={album.image}
          alt={`Pixelated album cover for ${album.name} by ${album.artist}`}
          className="album-cover"
          style={{ filter: won ? "none" : `blur(${pixelationLevels[attempts]}px)` }}
        />
      </div>
  
      {!gameOver ? (
        <>
          <input
            type="text"
            id="guess-input"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter album name"
            aria-label="Enter album name"
            autoFocus
          />
          <button onClick={() => handleGuess()} aria-label="Submit guess">Submit</button>
  
          {incorrectGuesses.length > 0 && (
            <div className="incorrect-guesses">
              <h3>Incorrect Guesses:</h3>
              <ul>
                {incorrectGuesses.map((wrongGuess, index) => (
                  <li key={index}>{wrongGuess}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="result" role="alert" aria-live="assertive" tabIndex={0}>
          {won ? (
            <h2>🎉 Correct! It's {album.name} by {album.artist}!</h2>
          ) : (
            <h2>❌ Out of attempts! The album is {album.name} by {album.artist}!</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
