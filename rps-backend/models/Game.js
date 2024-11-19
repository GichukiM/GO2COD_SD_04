const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    playerOne: {
        type: String,
        required: true,
    },
    playerTwo: {
        type: String,
        required: true,
    },
    winner: { 
        type: String,
        required: true,
     },
     moves: {
        playerOne: {
            type: String,
            required: true,
        },
        playerTwo: {
            type: String,
            required: true,
        }
     },
     timestamp: {
        type: Date,
        default: Date.now,
     }
});

module.exports = mongoose.model('Game', GameSchema);