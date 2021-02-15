const mongoose = require("mongoose");
const { questionSchema } = require("./question");

const roundSchema = new mongoose.Schema({
  _id: { type: String, required: false },
  categories: { type: [String], required: true },
  questions: { type: [questionSchema], required: false }, //Te veel redundantie?
  points: {
    teams: [
      {
        _id: { type: String },
        answer: { type: String },
        correctAnswer: { type: Boolean },
        totalCorrect: { type: Number },
        score: { type: Number },
      },
    ],
  },
});

module.exports = {
  roundSchema,
};
