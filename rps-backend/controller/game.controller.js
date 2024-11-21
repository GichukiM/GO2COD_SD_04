const Game = require("../models/Game");
const Leaderboard = require("../models/Leaderboard");
const { v4: uuidv4 } = require("uuid");

// Helper function to calculate the winner
const calculateWinner = (playerOneMoves, playerTwoMoves) => {
  const playerOneMove = playerOneMoves[playerOneMoves.length - 1];
  const playerTwoMove = playerTwoMoves[playerTwoMoves.length - 1];

  if (playerOneMove === playerTwoMove) return "Draw";
  if (
    (playerOneMove === "rock" && playerTwoMove === "scissors") ||
    (playerOneMove === "scissors" && playerTwoMove === "paper") ||
    (playerOneMove === "paper" && playerTwoMove === "rock")
  ) {
    return "Player One";
  }
  return "Player Two";
};

// Start a new game
exports.startNewGame = async (req, res) => {
  const { playerOne, playerTwo } = req.body;

  if (!playerOne || !playerTwo) {
    return res.status(400).json({ error: "Missing player information." });
  }

  const gameId = uuidv4(); // Generate unique gameId

  try {
    const newGame = new Game({
      gameId,
      playerOne,
      playerTwo,
      winner: "", // Will be determined later
      moves: {
        playerOne: [],
        playerTwo: [],
      },
      rounds: 0, // Start from round 0
      gameStatus: "ongoing",
    });

    await newGame.save();

    res.status(201).json({
      gameId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(error.message);
  }
};

const getComputerMove = () => {
  const moves = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

exports.makeMove = async (req, res) => {
  const { gameId, player, move } = req.body;
  const validMoves = ["rock", "paper", "scissors"];

  if (!validMoves.includes(move)) {
    return res.status(400).json({ error: "Invalid move." });
  }

  try {
    // Find the game by gameId
    const game = await Game.findOne({ gameId });

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    if (game.gameStatus === "ended") {
      return res.status(400).json({ error: "Game has already ended." });
    }

    // Ensure moves array is initialized for both players
    if (!game.moves.playerOne) game.moves.playerOne = [];
    if (!game.moves.playerTwo) game.moves.playerTwo = [];

    // Record Player One's move
    if (player === game.playerOne) {
      game.moves.playerOne.push(move);
    }

    // After Player 1's move, the Computer (Player 2) makes a move
    if (player === game.playerOne) {
      // Get computer's move and record it for Player Two
      const computerMove = getComputerMove();
      game.moves.playerTwo.push(computerMove);
    }

    // Update the number of rounds
    game.rounds += 1;

    // Determine the round winner (Player 1 vs. Player 2)
    const roundWinner = calculateWinner(game.moves.playerOne, game.moves.playerTwo);

    if (roundWinner !== "Draw") {
      game.winner = roundWinner;
    }

    // End game after 10 rounds (or as per your logic)
    if (game.rounds >= 10) {
      game.gameStatus = "ended";
      const finalWinner = calculateWinner(game.moves.playerOne, game.moves.playerTwo);
      game.winner = finalWinner;

      // Update leaderboard
      if (finalWinner !== "Draw") {
        await Leaderboard.updateOne(
          { playerName: finalWinner },
          { $inc: { wins: 1 } },
          { upsert: true }
        );
      }
    }

    game.markModified("moves");

    // Save the updated game state
    await game.save();

    // Send back the updated game state
    res.status(200).json({
      gameId,
      winner: roundWinner,
      moves: game.moves,
      rounds: game.rounds,
      gameStatus: game.gameStatus,
    });
  } catch (error) {
    console.error("Error during makeMove:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// End the game manually
exports.endGame = async (req, res) => {
  const { gameId } = req.body;

  try {
    const game = await Game.findOne({ gameId });

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    game.gameStatus = "ended"; // Mark game as ended
    const winner = calculateWinner(game.moves.playerOne, game.moves.playerTwo); // Calculate winner
    game.winner = winner;

    // Update leaderboard for the winner
    if (winner !== "Draw") {
      await Leaderboard.updateOne(
        { playerName: winner },
        { $inc: { wins: 1 } },
        { upsert: true }
      );
    }

    await game.save();

    res.status(200).json({
      gameId,
      winner: game.winner,
      moves: game.moves,
      rounds: game.rounds,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
