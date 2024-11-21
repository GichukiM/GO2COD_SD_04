const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true, // Ensure the gameId is unique
  },
  playerOne: {
    type: String,
    required: true,
  },
  playerTwo: {
    type: String,
    required: true,
  },
  winner: { type: String, required: false, default: "" },
  moves: {
    playerOne: {
      type: [String], // List of moves
      required: true,
    },
    playerTwo: {
      type: [String], // List of moves
      required: true,
    },
  },
  rounds: {
    type: Number,
    default: 0, // Initialize rounds at 0
  },
  gameStatus: {
    type: String,
    enum: ["ongoing", "ended"],
    default: "ongoing",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Game", GameSchema);
