const express = require('express');
const router = express.Router();    
const { getLeaderboard } = require('../controller/leaderboard.controller.js');

router.get('/', getLeaderboard);

module.exports = router;