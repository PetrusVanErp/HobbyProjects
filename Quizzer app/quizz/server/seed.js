const mongoose = require("mongoose");
const questions = require("./resources/questions.json");

require("./models/question");
require("./models/quiz");

const dbName = "Quizzer";
const db = mongoose.connection;
const Question = mongoose.model("Question");
const Quiz = mongoose.model("Quiz");

mongoose
  .connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true })
  .then(() => {
    return seed();
  })
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log("The database was succesfully seeded");
    db.close();
  });

async function seed() {
  await seedQuestions();
  await seedQuiz();
}

async function seedQuestions() {
  await Question.deleteMany();
  await Question.insertMany(questions);
}

async function seedQuiz() {
  await Quiz.deleteMany();
  await Quiz.insertMany([
    {
      _id: "Quiz2",
      room: "22",
      teams: [
        {
          _id: "gladiator",
          name: "gladiator",
          score: 2.2,
          answer: "No Answer",
        },
        {
          _id: "team2",
          name: "team2",
          score: 4.1,
          answer: "No Answer",
        },
        {
          _id: "team3",
          name: "team3",
          score: 0,
          answer: "No Answer",
        },
      ],
      rounds: [
        {
          _id: "Round1",
          categories: ["Geography", "Music", "Sport"],
          questions: [
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
            {
              _id: mongoose.Types.ObjectId(),
              question:
                "What was the title of Bob the Builder`s second UK number one hit single?",
              answer: "22 April",
              category: "Music",
            },
          ],
          points: {
            teams: [
              {
                _id: "gladiator",
                totalCorrect: 8,
                score: 4,
              },
              {
                _id: "team2",
                totalCorrect: 5,
                score: 0.1,
              },
            ],
          },
        },
      ],
      currentRound: {
        _id: "Round2",
        categories: ["Geography", "Music", "Sport"],
        questions: [
          {
            _id: mongoose.Types.ObjectId(),
            question:
              "What was the title of Bob the Builder`s second UK number one hit single?",
            answer: "22 April",
            category: "Music",
          },
        ],
        points: {
          teams: [
            {
              _id: "gladiator",
              answer: "Bannaan",
              correctAnswer: true,
              totalCorrect: 7,
              score: 0,
            },
            {
              _id: "team2",
              answer: "ballet",
              correctAnswer: false,
              totalCorrect: 9,
              score: 0,
            },
            {
              _id: "team3",
              answer: "ballet",
              correctAnswer: false,
              totalCorrect: 6,
              score: 0,
            },
          ],
        },
      },
      currentQuestion: {
        _id: "Question1",
        question: "When is Pieters birthday?",
        answer: "22 April",
        category: {
          _id: "Category1",
          name: "Famous birthdays",
        },
      },
    },
  ]);
}
