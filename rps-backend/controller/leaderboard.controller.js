const Leaderboard = require('../models/Leaderboard.js');

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .sort({ wins: -1})
            .limit(10);
        
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }
}