const Game = require("../models/Game");
const Leaderboard = require("../models/Leaderboard");

// Fetch leaderboard details
exports.getLeaderboard = async (req, res) => {
  const { gameId } = req.query;

  try {
    // Fetch the game based on gameId
    const game = await Game.findOne({ gameId });

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    // Fetch the leaderboard for the winner
    const leaderboardEntry = await Leaderboard.find({ playerName: game.winner });

    res.status(200).json(leaderboardEntry);
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ error: error.message });
  }
};
