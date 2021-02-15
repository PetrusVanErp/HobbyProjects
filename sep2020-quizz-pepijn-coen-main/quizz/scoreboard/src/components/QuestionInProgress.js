import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
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

export default function getQuizCurrentQuestion(props) {
  const classes = useStyles();

  const [questionStatus, setQuestionStatus] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [redirectQuiz, setRedirectQuiz] = useState(false);
  const [redirectAnswer, setRedirectAnswer] = useState(false);

  function handleOnQuizNav() {
    setRedirectQuiz(true)
  }

  function handleOnAnswerNav() {
    setRedirectAnswer(true)
  }

  useEffect(() => {
    async function getQuizQuestionStatus() {
      return await fetch(
        `http://localhost:4000/quizzes/${props.quizId}/questionstatus`,
        {
          method: "get",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setQuestionStatus(data);
        });
    }

    getQuizQuestionStatus();
  }, []);

  async function getQuizQuestionStatusses() {
    return await fetch(
      `http://localhost:4000/quizzes/${props.quizId}/questionstatus`,
      {
        method: "get",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setQuestionStatus(data);
      });
  }

  let ws = null
  if (!props.scoreboardWs) {
    setRedirect(true)
  } else {
    ws = getWebSocket();

    ws.onmessage = function (message) {
      const parsedMessage = JSON.parse(message.data)
      console.log("message received: " + parsedMessage.messageType)

      switch (parsedMessage.messageType) {
        case "QUESTIONINPROGRESS":
          getQuizQuestionStatusses();
          break;
        case "NEXTQUESTION":
          getQuizQuestionStatusses();
          break;
        default: console.log("Unknown messageType:", parsedMessage.messageType);
      }
    }
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
          pathname: `/`,
        }}
      />
    );
  }

  
  if (redirectQuiz) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}`,
        }}
      />
    );
  }


  if (redirectAnswer) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/questions/answers`,
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
      <h2>Teams finished answering</h2>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow>
                {questionStatus.teamsDone.map((team) => {
                    return (<TableCell key={team._id}>{team._id}</TableCell>)
                })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button color="primary" onClick={handleOnQuizNav}>
          To quiz status and scores
        </Button>
        <Button color="primary" onClick={handleOnAnswerNav}>
          To current answers
        </Button>
      </div>
    </React.Fragment>
  );
}
