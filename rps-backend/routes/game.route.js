const express = require('express');
const router = express.Router();
const { playGame } = require('../controller/game.controller.js');

router.post('/play', playGame);

module.exports = router;