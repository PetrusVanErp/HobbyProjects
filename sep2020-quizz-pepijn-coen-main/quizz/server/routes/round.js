const mongoose = require("mongoose");
require("../models/quiz.js");

mongoose.set("useFindAndModify", false);

const express = require("express");
const router = express.Router();

var helper = require("../resources/helper");
const Quiz = mongoose.model("Quiz");

router.post("/:quizId/rounds/", async (req, res) => {
  console.log(`Request to add a new round to quiz ${req.params.quizId}`);

  const quiz = await Quiz.findOne({
    _id: req.params.quizId,
  });

  const allTeams = quiz.teams;

  const roundTeams = allTeams.map((team) => {
    return {
      _id: team.name,
      answer: "Answering...",
      score: 0,
      totalCorrect: 0,
    };
  });

  const newRound = {
    _id: "Round " + quiz.rounds.length,
    categories: req.body.categories,
    questions: [],
    points: {
      teams: roundTeams,
    },
  };

  await Quiz.findByIdAndUpdate(req.params.quizId, {
    $set: {
      currentRound: newRound,
    },
  }).then(() => {
    console.log(`New round ${newRound._id} was succesfully started!`);
  });

  res.json({ response: "New round was succesfully started" });
});

router.put("/:quizId/rounds", async (req, res) => {
  console.log(
    `Request to end the round of quiz ${req.params.quizId} and update the team scores`
  );
  const newQuizResult = await updateQuizRound(req, res);

  const { scoreboardClients } = require("../server.js");
  if (scoreboardClients.length > 0) {
    const client = scoreboardClients.find(function (element) {
      return element.roomId === newQuizResult.room;
    });

    if (!client) {
      res.json({
        response: "The round was succesfully ended and the scores were updated",
      });
      return;
    }
    const scoreboardWs = client.socket;

    const teamAnswerProcessed = {
      messageType: "ENDROUND",
    };

    scoreboardWs.send(JSON.stringify(teamAnswerProcessed));

    res.json({
      response: "The round was succesfully ended and the scores were updated",
    });
  } else {
    res.json({
      response: "The round was succesfully ended and the scores were updated",
    });
  }
});

async function updateQuizRound(req, res) {
  const quiz = await Quiz.findOne({
    _id: req.params.quizId,
  });

  if (quiz.currentQuestion) {
    await Quiz.findByIdAndUpdate(
      { _id: req.params.quizId },
      {
        $push: { "currentRound.questions": quiz.currentQuestion },
      }
    ).then(() => {
      console.log(
        `The current question was finished and added to the current rounds`
      );
    });
  }

  const newQuiz = helper.endRoundAndDetermineTeamScores(quiz);

  const newQuizResult = await Quiz.findOneAndUpdate(
    {
      _id: req.params.quizId,
    },
    newQuiz
  );

  return newQuizResult;
}

module.exports = router;
