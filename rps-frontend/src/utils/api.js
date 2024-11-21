const BASE_URL = "http://localhost:5000/api";

// Start a new game
export const startNewGame = async () => {
  const response = await fetch(`${BASE_URL}/game/start-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerOne: "Player 1",
      playerTwo: "Computer", // Since player 2 is the computer
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start the game: ${response.statusText}`);
  }

  const { gameId } = await response.json();
  return gameId;
};

// Make a move
export const makeMove = async (gameId, move) => {
  const response = await fetch(`${BASE_URL}/game/make-move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId,
      player: "Player 1", // Always Player 1 making the move
      move,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to make a move: ${response.statusText}`);
  }

  const gameData = await response.json();
  return gameData;
};

// End the game
export const endGame = async (gameId) => {
  const response = await fetch(`${BASE_URL}/game/end-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to end the game: ${response.statusText}`);
  }

  const gameData = await response.json();
  return gameData;
};


  
