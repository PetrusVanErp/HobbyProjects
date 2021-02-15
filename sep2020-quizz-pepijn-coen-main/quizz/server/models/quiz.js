const mongoose = require("mongoose");
const { teamSchema } = require("./team");
const { roundSchema } = require("./round");
const { questionSchema } = require("./question");

const quizSchema = new mongoose.Schema({
  _id: { type: String, required: false },
  room: { type: String, required: true },
  teams: { type: [teamSchema], required: false },
  rounds: { type: [roundSchema], required: false },
  currentRound: { type: roundSchema, required: false },
  currentQuestion: { type: questionSchema, required: false },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { quizSchema };
