const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

require("../models/quiz.js");

const Quiz = mongoose.model("Quiz");

router.post("/:roomId", async (req, res) => {
  console.log(`Request to add ${req.body.teamId} to room ${req.params.roomId}`);

  const { quizMasterClients } = require("../server.js");
  const client = quizMasterClients.find(function (element) {
    return element.roomId === req.params.roomId;
  });
  console.log("client: " + client);
  const ws = client.socket;

  console.log("ws: " + ws);

  const theMessage = {
    messageType: "TEAMAPPLY",
    teamName: req.body.teamId,
    roomNr: req.params.roomId,
    userId: req.body.userId,
  };

  console.log("message sent: " + JSON.stringify(theMessage));
  ws.send(JSON.stringify(theMessage));

  res.json({
    response: `${req.body.teamId} was succesfully added to the room. Wait for approval from the quiz master.`,
  });
});

router.get("/:roomId", async (req, res) => {
  console.log(`Request to get the quiz with room id ${req.params.roomId}`);
  const quiz = await Quiz.findOne({room: req.params.roomId});
  console.log("Quiz was searched for");
  console.log(quiz)
  res.json(quiz);
});

module.exports = router;
