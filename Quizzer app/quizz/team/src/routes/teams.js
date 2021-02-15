'use strict';

const mongoose = require('mongoose');
require('../models/teams.js');

const express = require('express');
const router = express.Router();

const Team = mongoose.model('Team');

router.post('/teams/:team', async (req, res) => {
    await Team.insertMany({
        _id: req.params.team,
        room: req.body.room,
        name: req.params.team,
        score: 0,
        answer: ""
    })
    res.json("Team added to the room")
});

router.put('/teams/:teamName', (req, res) => {
    Team.findByIdAndUpdate(req.params.teamName, {$set: {answer: req.body.answer}}).then(team => {
        res.json("team answer updated")
    })
});

module.exports = router;