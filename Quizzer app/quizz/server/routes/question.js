const mongoose = require("mongoose");
require("../models/question.js");
require("../models/quiz.js");

mongoose.set("useFindAndModify", false);

const express = require("express");
const router = express.Router();

const Question = mongoose.model("Question");

// Get all questions from certain categories
router.get("/", async (req, res, next) => {
  if (!req.query.category1) {
    return next();
  }

  const category1 = req.query.category1;
  const category2 = req.query.category2;
  const category3 = req.query.category3;

  const questions = await Question.find({
    category: {
      $in: [category1, category2, category3],
    },
  });
  res.json(questions);
});

router.get("/", async (req, res) => {
  const questions = await Question.find({});
  res.json(questions);
});


router.get("/categories", async (req, res) => {
  const categories = await Question.distinct("category", {});
  res.json(categories);
});


router.get("/:questionId", async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.questionId)
  const answer = await Question.findOne(id, {answer: 1});
  res.json(answer);
});

module.exports = router;
