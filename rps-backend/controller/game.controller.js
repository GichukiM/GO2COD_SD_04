const Game = require("../models/Game.js");
const Leaderboard = require("../models/Leaderboard.js");

// Helper function to calculate the winner
const calculateWinner = (playerOneMove, playerTwoMove) => {
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

// Helper function to predict the computer's move
const getComputerMove = (playerHistory) => {
  const moveCounts = { rock: 0, paper: 0, scissors: 0 };

  playerHistory.forEach((move) => moveCounts[move]++);

  const predictedMove = Object.keys(moveCounts).reduce((a, b) =>
    moveCounts[a] > moveCounts[b] ? a : b
  );

  const counterMoves = { rock: "paper", paper: "scissors", scissors: "rock" };

  return counterMoves[predictedMove];
};

// Main game logic
exports.playGame = async (req, res) => {
  const { playerOne, playerOneMove, playerHistory = [] } = req.body;

  const playerTwoMove = getComputerMove(playerHistory);

  const winner = calculateWinner(playerOneMove, playerTwoMove);

  const newGame = new Game({
    playerOne,
    playerTwo: "Computer",
    winner: winner === "Player One" ? playerOne : "Computer",
    moves: { playerOne: playerOneMove, playerTwo: playerTwoMove }, // Ensure proper structure here
  });

  try {
    await newGame.save();

    if (winner !== "Draw") {
      await Leaderboard.updateOne(
        { playerName: winner },
        { $inc: { wins: 1 } },
        { upsert: true }
      );
    }

    res.status(201).json({ winner, moves: { playerOneMove, playerTwoMove } });
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
};
