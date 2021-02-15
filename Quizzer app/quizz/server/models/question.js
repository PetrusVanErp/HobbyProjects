const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  _id: {type: String, required: false},
  question: {type: String, required: true},
  answer: {type: String, required: true},
  category: {type: String, required: true},
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {
    questionSchema
}


