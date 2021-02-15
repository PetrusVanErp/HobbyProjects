import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TeamResultsTable from "./TeamResultsTable";

import { getWebSocket } from "../serverCommunication.js";

import AnswerCard from "./AnswerCard";
import AcceptedAnswersTable from "./AcceptedAnswersTable";
import RejectedAnswersTable from "./RejectedAnswersTable";

export default function QuestionResults(props) {
  const ws = getWebSocket();

  const [teamsAnswered, setTeamsAnswered] = useState({ teams: [] });

  useEffect(() => {
    async function getTeams() {
      await fetch(`http://localhost:4000/quizzes/${props.quizId}/teams`, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          setTeamsAnswered(data);
        })
        .then(() => {
          console.log(teamsAnswered);
        });
    }
    getTeams();
  }, []);

  const [acceptedAnswers, setAcceptedAnswers] = useState({ teams: [] });
  const [rejectedAnswers, setRejectedAnswers] = useState({ teams: [] });

  const [questionCount, setQuestionCount] = useState(getQuestionCount());

  const [answer, setAnswer] = useState("");
  const [quizEndRedirect, setQuizEnd] = useState(false);
  const [nextQuestionRedirect, setNextQuestionRedirect] = useState(false);
  const [nextRoundRedirect, setNextRoundRedirect] = useState(false);

  async function showAnswerOnScoreboard() {
    await fetch(`http://localhost:4000/quizzes/${props.quizId}/showanswer`, {
      method: "get",
    });
  }

  async function handleRoundEnd() {
    await fetch(`http://localhost:4000/quizzes/${props.quizId}/rounds`, {
      method: "put",
    });
  }

  async function handleQuizEnd() {
    await handleRoundEnd();

    await showAnswerOnScoreboard();

    props.handleNextRound();
    setQuizEnd(true);
  }

  async function handleNextQuestion() {
    await showAnswerOnScoreboard();

    props.handleQuestionSelected(null);
    setNextQuestionRedirect(true);
  }

  async function handleNextRound() {
    await handleRoundEnd();

    await showAnswerOnScoreboard();
    props.handleNextRound();

    setNextRoundRedirect(true);
  }

  async function getQuestionCount() {
    await fetch(`http://localhost:4000/quizzes/${props.quizId}/questionCount`, {
      method: "get",
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestionCount(data.amount);
      });
  }

  async function handleTeamAnswer(e, team, answerCorrect) {
    await fetch(
      `http://localhost:4000/quizzes/${props.quizId}/teams/${team.name}/score`,
      {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answerCorrect: answerCorrect,
          answer: team.answer,
          teamName: team.name,
        }),
      }
    );

    if (answerCorrect) {
      console.log("Correct answer!");
      const newState = { ...acceptedAnswers };
      newState.teams.push(team);
      setAcceptedAnswers({ teams: newState.teams });
    } else if (!answerCorrect) {
      console.log("Incorrect answer!");
      const newState = { ...rejectedAnswers };
      newState.teams.push(team);
      setRejectedAnswers({ teams: newState.teams });
    }

    const newTeamsAnsweredState = { ...teamsAnswered };
    newTeamsAnsweredState.teams.forEach((element) => {
      if (element.name === team.name) {
        element.status = "handled";
      }
    });
    setTeamsAnswered(newTeamsAnsweredState);
  }

  ws.onmessage = function(message) {
    const parsedMessage = JSON.parse(message.data);
    console.log("message received: " + parsedMessage.messageType);
    switch (parsedMessage.messageType) {
      case "TEAMQUESTIONANSWER":
        console.log(
          "Team " +
            parsedMessage.teamName +
            " has answered the question with the answer: " +
            parsedMessage.teamAnswer
        );

        const newState = {
          teams: teamsAnswered.teams.map((team) => {
            //Team still has to answer or be scored
            if (team.name === parsedMessage.teamName) {
              console.log("HIER");
              team.answer = parsedMessage.teamAnswer;
            }
            return team;
          }),
        };

        setTeamsAnswered(newState);

        break;

      default:
        console.log("Unknown messageType:", parsedMessage.messageType);
    }
  };

  useEffect(() => {
    async function getAnswer() {
      return await fetch(
        `http://localhost:4000/questions/${props.question._id}`,
        {
          method: "get",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setAnswer(data.answer);
        });
    }

    getAnswer();
  }, []);

  if (quizEndRedirect) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  } else if (nextQuestionRedirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/questions`,
        }}
      />
    );
  } else if (nextRoundRedirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/categories`,
        }}
      />
    );
  }

  function NextQuestionButton(props) {
    return (
      <Button variant="contained" color="primary" onClick={handleNextQuestion}>
        Next Question
      </Button>
    );
  }

  function NextRoundButton(props) {
    return (
      <div>
        <Button variant="contained" color="secondary" onClick={handleQuizEnd}>
          End quiz
        </Button>
        <Button variant="contained" color="primary" onClick={handleNextRound}>
          Next Round
        </Button>
      </div>
    );
  }

  function NextQuestionOrRound(props) {
    console.log("QUESTION COUNT: " + questionCount);
    if (questionCount === 4) {
      return <NextRoundButton />;
    } else {
      return <NextQuestionButton />;
    }
  }

  return (
    <div className="QuestionResults">
      <h1>The answer</h1>
      <AnswerCard answer={answer}></AnswerCard>
      <br></br>

      <hr></hr>
      <h1>Check out the answer of every team</h1>
      <div className="NewResults">
        <h2>Teams</h2>
        <TeamResultsTable
          teamsAnswered={teamsAnswered}
          onHandleTeamAnswer={handleTeamAnswer}
        ></TeamResultsTable>
      </div>
      <div className="AcceptedAnswers">
        <h2>Accepted answers</h2>
        <AcceptedAnswersTable answers={acceptedAnswers}></AcceptedAnswersTable>
      </div>
      <div className="RejectedAnswers">
        <h2>Rejected answers</h2>
        <RejectedAnswersTable answers={rejectedAnswers}></RejectedAnswersTable>
      </div>
      <br></br>
      <NextQuestionOrRound />
    </div>
  );
}
