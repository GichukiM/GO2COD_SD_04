const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    playerName: {
        type: String,
        required: true,
    },
    wins: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);