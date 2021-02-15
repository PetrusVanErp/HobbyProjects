const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

require("../models/quiz.js");
require("../models/question.js");

mongoose.set("useFindAndModify", false);

const express = require("express");
const router = express.Router();

var helper = require("../resources/helper");
const Quiz = mongoose.model("Quiz");
const Question = mongoose.model("Question");

router.post("/:quizId/questions/:questionId", async (req, res) => {
  console.log(
    `Request to add ${req.params.questionId} to the current question of quiz ${req.params.quizId} to the database`
  );

  const question = await Question.findOne(new ObjectId(req.params.questionId));

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    { _id: req.params.quizId },
    {
      $set: { currentQuestion: question },
    }
  );

  const teams = updatedQuiz.currentRound.points.teams.map((team) => {
    team.answer = "Answering...";
    return team;
  });

  await Quiz.findByIdAndUpdate(
    { _id: req.params.quizId },
    {
      $set: {
        "currentRound.points.teams": teams,
      },
    }
  );

  const quiz = await Quiz.findOne({ _id: req.params.quizId });

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
  res.json({ response: "The new question was added" });
});

router.post("/:quizId/teams/:teamId/questions/answer", async (req, res) => {
  console.log(
    `Request to add ${req.body.answer} to the current question of quiz ${req.params.quizId} to the database`
  );

  const { quizMasterClients } = require("../server.js");
  const client = quizMasterClients.find(function (element) {
    return element.roomId === req.body.roomId;
  });
  console.log("client: " + client);
  const ws = client.socket;

  console.log("ws: " + ws);

  const teamQuestionAnswerMessage = {
    messageType: "TEAMQUESTIONANSWER",
    teamName: req.params.teamId,
    roomNr: req.body.roomId,
    teamAnswer: req.body.answer,
  };

  console.log("message sent: " + JSON.stringify(teamQuestionAnswerMessage));
  ws.send(JSON.stringify(teamQuestionAnswerMessage));

  res.json({
    response: `${req.body.answer} was succesfully added to the database.`,
  });
});

router.get("/:quizId/questionstatus", async (req, res) => {
  console.log(
    `Request to get the question state of quiz with id ${req.params.quizId}`
  );
  const quiz = await Quiz.findOne({
    _id: req.params.quizId,
  });

  res.json(helper.getQuizQuestionState(quiz));
});

module.exports = router;
