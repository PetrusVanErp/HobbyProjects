import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { Redirect } from "react-router-dom";

import { getWebSocket } from "../serverCommunication.js";

const useStyles = makeStyles({
  table: {
    maxWidth: 450,
  },
});

export default function questionAnswered(props) {
  const classes = useStyles();

  const [questionStatus, setQuestionStatus] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [redirectQuestion, setRedirectQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  function handleOnQuestionNav() {
    setRedirectQuestion(true);
  }

  useEffect(() => {
    getQuizQuestionStatusses();
  }, []);

  function inTeamsDone(array, team) {
    let bool = false;
    array.forEach((element) => {
      if (element._id === team) {
        bool = true;
      }
    });
    return bool;
  }

  function getQuestionAnswer(team) {
    let answer = "";
    questionStatus.teamsDone.forEach((element) => {
      if (element._id === team) {
        answer = element.answer;
      }
    });
    return answer;
  }

  async function getQuizQuestionStatusses() {
    return await fetch(
      `http://localhost:4000/quizzes/${props.quizId}/questionstatus`,
      {
        method: "get",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setQuestionStatus(data);
      });
  }

  let ws = null;
  if (!props.scoreboardWs) {
    setRedirect(true);
  } else {
    ws = getWebSocket();
    ws.onmessage = function(message) {
      const parsedMessage = JSON.parse(message.data);
      console.log("message received: " + parsedMessage.messageType);

      switch (parsedMessage.messageType) {
        case "QUESTIONINPROGRESS":
          getQuizQuestionStatusses();
          break;
        case "NEXTQUESTION":
          getQuizQuestionStatusses();
          setShowAnswer(false);
          break;
        case "SHOWANSWER":
          getQuizQuestionStatusses();
          setShowAnswer(true);
          break;

        default:
          console.log("Unknown messageType:", parsedMessage.messageType);
      }
    };
  }

  if (!questionStatus) {
    return (
      <React.Fragment>
        <h4>No question has been chosen...</h4>
      </React.Fragment>
    );
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}`,
        }}
      />
    );
  }

  if (redirectQuestion) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/questions`,
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <h1>Question</h1>
      <strong>{questionStatus.question.question}</strong>
      <h2>Category</h2>
      <strong>{questionStatus.category}</strong>
      <h2>Answers</h2>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell key="TeamName">TeamName</TableCell>
              <TableCell key="Answered">Answered</TableCell>
              <TableCell key="GivenAnswer">GivenAnswer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionStatus.teams.map((team) => {
              return (
                <TableRow key={team._id}>
                  <TableCell key={team._id + "TeamName"}>{team.name}</TableCell>
                  <TableCell key={team._id + "Answered"}>
                    {inTeamsDone(questionStatus.teamsDone, team.name)
                      ? "Yes"
                      : "No"}
                  </TableCell>
                  <TableCell key={team._id + "GivenAnswer"}>
                    {inTeamsDone(questionStatus.teamsDone, team.name)
                      ? getQuestionAnswer(team.name)
                      : ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <h3>Correct answer:</h3>
        <h4>
        {showAnswer
          ? questionStatus.question.answer
          : "Waiting the teams to answer..."}
      </h4>
      <div>
        <Button color="primary" onClick={handleOnQuestionNav}>
          To current question
        </Button>
      </div>
    </React.Fragment>
  );
}
