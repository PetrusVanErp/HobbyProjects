const mongoose = require("mongoose");

require("../models/quiz.js");

mongoose.set("useFindAndModify", false);

const express = require("express");
const router = express.Router();

var helper = require("../resources/helper");
const Quiz = mongoose.model("Quiz");

router.get("/:quizId/teams", async (req, res) => {
  console.log(`Request to get all teams from quiz ${req.params.quizId}`);

  const quiz = await Quiz.findById(
    { _id: req.params.quizId },
    { "teams.name": 1 }
  );

  res.json({ teams: quiz.teams });
});

router.get("/:quizId/questions/", async (req, res) => {
  console.log(
    `Request to get all questions that appeared on quiz ${req.params.quizId}`
  );

  const quiz = await Quiz.findOne({
    _id: req.params.quizId,
  });

  let questions = [];

  if (quiz.rounds) {
    questions = quiz.rounds.map((round) => {
      return round.questions.map((question) => question._id);
    });
  }

  if (quiz.currentRound) {
    quiz.currentRound.questions.map((question) => {
      questions.push(question._id);
    });
  }

  const merged = [].concat.apply([], questions);
  if (quiz.currentQuestion) {
    merged.push(quiz.currentQuestion._id);
  }

  res.json(merged);
});

router.get("/:quizId/showanswer", async (req, res) => {
  const { scoreboardClients } = require("../server.js");

  if (scoreboardClients.length > 0) {
    const quiz = await Quiz.findOne({ _id: req.params.quizId });

    const client = scoreboardClients.find(function (element) {
      return element.roomId === quiz.room;
    });

    if (client) {
      const scoreboardWs = client.socket;

      const teamAnswerProcessed = {
        messageType: "SHOWANSWER",
      };

      scoreboardWs.send(JSON.stringify(teamAnswerProcessed));
    }
  }

  res.json({ response: "Answer has been shown on the scoreboard" });
});

router.get("/:quizId/questionCount", async (req, res) => {
  console.log("Request to get the amount of questions in the current round");
  const quiz = await Quiz.findOne({
    _id: req.params.quizId,
  });
  if (!quiz.currentRound) {
    res.json({ amount: 0 });
  } else if (!quiz.currentRound.questions) {
    res.json({ amount: 0 });
  } else {
    res.json({ amount: quiz.currentRound.questions.length });
  }
});

router.put("/:quizId/teams/:teamId/score", async (req, res) => {
  console.log(
    `Request to add points to the current score of ${req.params.teamId} in quiz ${req.params.quizId}`
  );

  if (req.body.answerCorrect) {
    await Quiz.findOneAndUpdate(
      {
        _id: req.params.quizId,
        "currentRound.points.teams._id": req.params.teamId,
      },
      {
        $inc: {
          "currentRound.points.teams.$.totalCorrect": 1,
        },
      }
    );
  }

  await Quiz.findOneAndUpdate(
    {
      _id: req.params.quizId,
      "currentRound.points.teams._id": req.params.teamId,
    },
    {
      "currentRound.points.teams.$.answer": req.body.answer,
    }
  );

  const { scoreboardClients } = require("../server.js");

  if (scoreboardClients.length > 0) {
    const quiz = await Quiz.findOne({ _id: req.params.quizId });

    const client = scoreboardClients.find(function (element) {
      return element.roomId === quiz.room;
    });

    if (client) {
      const scoreboardWs = client.socket;

      const teamAnswerProcessed = {
        messageType: "QUESTIONINPROGRESS",
      };

      scoreboardWs.send(JSON.stringify(teamAnswerProcessed));
    }
  }

  const { teamClients } = require("../server.js");

  const client = teamClients.find(function (element) {
    return element.teamId.replace(/%20/g, " ") === req.body.teamName;
  });
  const teamWs = client.socket;

  const teamAnswerProcessed = {
    messageType: "ANSWERPROCESSED",
  };
  teamWs.send(JSON.stringify(teamAnswerProcessed));

  res.json({ response: "The update was succesful!" });
});

router.post("/:quizId", async (req, res) => {
  console.log(
    `Request to add the quiz with id ${req.params.quizId} in room ${req.body.room}`
  );
  await Quiz.insertMany({
    _id: req.params.quizId,
    room: req.body.room,
  });
  console.log("quiz succesfully added");
  res.json({ response: "quiz succesfully added" });
});

router.get("/:quizId/scores", async (req, res) => {
  console.log(`Request get the scores from quiz with id ${req.params.quizId}`);
  const quiz = await Quiz.findOne({
    _id: req.params.quizId,
  });
  res.json(helper.getScores(quiz));
});

router.get("/:quizId", async (req, res) => {
  console.log(`Request to get the quiz with id ${req.params.quizId}`);
  const result = await Quiz.findOne({
    _id: req.params.quizId,
  });
  res.json(result);
});

router.post("/:quizId/teams/:teamId", async (req, res) => {
  console.log(
    `Request to add ${req.params.teamId} to quiz ${req.params.quizId}`
  );

  const newTeam = {
    _id: mongoose.Types.ObjectId(),
    name: req.params.teamId,
    score: 0,
  };

  await Quiz.findByIdAndUpdate(
    { _id: req.params.quizId },
    {
      $push: { teams: newTeam },
    }
  ).then(() => {
    console.log(
      "team " + req.params.teamId + " was succesfully added to the quiz"
    );
  });

  const { teamClients } = require("../server.js");
  const client = teamClients.find(function (element) {
    return element.userId === req.body.userId;
  });
  const ws = client.socket;

  let entrantAcceptMessage = {
    messageType: "ENTRANTACCEPTED",
    quizId: req.params.quizId,
  };
  console.log("message sent: " + JSON.stringify(entrantAcceptMessage));
  ws.send(JSON.stringify(entrantAcceptMessage));

  res.json({ response: `${req.params.teamId} was succesfully added.` });
});

router.delete("/:quizId/teams/:teamId", async (req, res) => {
  console.log(`Request to remove ${req.params.teamId} from the room`);

  const { teamClients } = require("../server.js");
  teamClients.forEach(element => {
    console.log(element.userId)
  });

  const client = teamClients.find(function (element) {
    return element.userId === req.body.userId;
  });

  const ws = client.socket;

  let entrantRejectedMessage = {
    messageType: "ENTRANTREJECTED",
    team: req.params.teamId
  };
  console.log("message sent: " + JSON.stringify(entrantRejectedMessage));
  ws.send(JSON.stringify(entrantRejectedMessage));

  res.json({ response: `${req.params.teamId} was succesfully removed.` });
});

module.exports = router;
