import React, { useEffect, useState } from "react";

import Scores from "./scores";

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

export default function quizInProgress(props) {
  const classes = useStyles();

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [redirectQuestion, setRedirectQuestion] = useState(false);
  const [scores, setScores] = useState(null);

  function handleOnQuestionNav() {
    setRedirectQuestion(true)
  }

  async function getScores() {
    return await fetch(`http://localhost:4000/quizzes/${props.quizId}/scores`, {
      method: "get",
    })
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      });
  }

  async function getQuiz() {
    return await fetch(`http://localhost:4000/quizzes/${props.quizId}/`, {
      method: "get",
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentQuiz(data);
      });
  }

  useEffect(() => {
    checkWebsocket();
    getQuiz();
    getScores();
  }, []);

  function checkWebsocket() {
    let ws = null;

    if (!props.scoreboardWs) {
      setRedirect(true);
    } else {
      ws = getWebSocket();

      ws.onmessage = function (message) {
        const parsedMessage = JSON.parse(message.data);
        console.log("message received: " + parsedMessage.messageType);

        switch (parsedMessage.messageType) {
          case "NEXTQUESTION":
            getQuiz();
            break;
          case "ENDROUND":
            getQuiz();
            getScores();
            break;
          default:
            console.log("Unknown messageType:", parsedMessage.messageType);
        }
      };
    }
  }

  if (!currentQuiz) {
    return (
      <React.Fragment>
        <h4>Searching for the quiz...</h4>
      </React.Fragment>
    );
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/`,
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
      <h1>The quiz is currently in progress...</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Question being answered</TableCell>
              <TableCell align="right">Rounds played</TableCell>
              <TableCell align="right">Current question</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key="question">
              <TableCell align="right">
                {currentQuiz.currentQuestion
                  ? currentQuiz.currentQuestion.question
                  : "No question has been selected..."}
              </TableCell>
              <TableCell align="right">{currentQuiz.rounds.length}</TableCell>
              <TableCell align="right">
                {currentQuiz.currentRound
                  ? currentQuiz.currentRound.questions.length
                  : "0"}
                /12
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h2>Scores</h2>
      <Scores
        currentQuiz={currentQuiz}
        scores={scores}
        quizId={props.quizId}
      ></Scores>
      <div>
        <Button color="primary" onClick={handleOnQuestionNav}>
          To current question
        </Button>
      </div>
    </React.Fragment>
  );
}
