const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    playerName: {
        type: String,
        required: true,
    },
    wins: {
        type: Number,
        default: 0,
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
