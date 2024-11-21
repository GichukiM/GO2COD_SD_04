import { useState } from "react";
import AnimationWrapper from "../components/AnimationWrapper";
import { startNewGame, makeMove, endGame } from "../utils/api.js";

const Game = () => {
  const [gameId, setGameId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [playerMove, setPlayerMove] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Start new game
  const initiateGame = async () => {
    try {
      const newGameId = await startNewGame();
      setGameId(newGameId);
      setGameStarted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMove = async (move) => {
    if (!gameId) {
      setError("No game started. Please start a new game.");
      return;
    }

    setPlayerMove(move);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await makeMove(gameId, move);
      setResult({
        winner: data.winner,
        moves: data.moves,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    if (!gameId) return;

    try {
      const data = await endGame(gameId);
      setResult({
        winner: data.winner,
        moves: data.moves,
      });
      setGameStarted(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AnimationWrapper>
      <div className="flex flex-col justify-center items-center bg-gray-900 h-screen space-y-8 p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Make Your Move
        </h1>

        {/* Start Game Button */}
        {!gameStarted && (
          <button
            onClick={initiateGame}
            className="py-2 px-6 mb-8 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          >
            Start Game
          </button>
        )}

        <div className="relative w-64 h-64 flex justify-center items-center sm:w-80 sm:h-80">
          {/* Circle container */}
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-yellow-300"></div>

          {/* Buttons positioned around the circle */}
          {["rock", "paper", "scissors"].map((move, index) => (
            <div
              key={move}
              className="absolute flex justify-center items-center"
              style={{
                transform: `rotate(${index * 120}deg)`,
              }}
            >
              {/* Image Button */}
              <div
                onClick={() => handleMove(move)}
                className={`cursor-pointer ${
                  !gameStarted && "opacity-50 pointer-events-none"
                }`}
                style={{
                  transform: `translateY(-125px)`,
                }}
              >
                <img
                  src={`/${move}.svg`}
                  alt={move}
                  className="w-24 h-24 rounded-full border-4 bg-yellow-400 border-gray-700 hover:scale-105 transform transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-blue-500 text-lg animate-pulse">Loading...</p>
        )}
        {error && (
          <p className="text-red-500 text-lg mt-4">{`Error: ${error}`}</p>
        )}

        {result && (
          <div className="mt-8 p-4 bg-yellow-300 rounded-lg shadow-lg text-center w-full sm:w-2/3">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {result.winner === "Draw"
                ? "It's a draw!"
                : `${result.winner} wins!`}
            </p>
            <p className="text-lg text-gray-700">
              You selected: {result.moves.playerOne.slice(-1)[0]}
            </p>
            <p className="text-lg text-gray-700">
              Computer selected: {result.moves.playerTwo.slice(-1)[0]}
            </p>
            <button
              onClick={handleEndGame}
              className="mt-6 py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
            >
              End Game
            </button>
          </div>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default Game;
