const express = require('express');
const router = express.Router();
const { startNewGame, makeMove, endGame } = require('../controller/game.controller.js');

// Route to start a new game
router.post('/start-game', startNewGame);

// Route to make a move in the game
router.post('/make-move', makeMove);

// Route to end the game
router.post('/end-game', endGame);

module.exports = router;
