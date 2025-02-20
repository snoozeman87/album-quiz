import React, { useState, useEffect, useCallback } from "react";
import "./Game.css"; // For styling

// Array of albums for the daily game
const albums = [
  { name: "Abbey Road", artist: "The Beatles", image: "/abbey_road.png" },
  { name: "The Dark Side of the Moon", artist: "Pink Floyd", image: "/dark-side-of-the-moon.jpg" },
  { name: "Nevermind", artist: "Nirvana", image: "/nevermind.jpg" }
  // Add more albums here as needed
];

// Get the album for the current day based on the day of the year
const getDailyAlbum = () => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)); // Get day of the year
  const albumIndex = dayOfYear % albums.length;
  return albums[albumIndex];
};

// Check if the date has changed (for UK time)
const hasNewDayStarted = () => {
  const lastPlayedDate = localStorage.getItem("lastPlayedDate");
  const currentDate = new Date();

  // Convert current time to UK time (GMT)
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
  const pixelationLevels = [80, 60, 40, 20, 5, 0];

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

  // Reset game state if it's a new day (midnight UK time)
  useEffect(() => {
    if (hasNewDayStarted()) {
      setAttempts(0);
      setGameOver(false);
      setWon(false);
      setIncorrectGuesses([]);
      localStorage.setItem("lastPlayedDate", new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }));
    }
  }, []);

  // Listen for "Enter" key
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
          style={{ filter: `blur(${pixelationLevels[attempts]}px)` }}
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
            <h2>❌ Out of attempts! The album was {album.name}.</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
