import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { Redirect } from "react-router-dom";

import { getWebSocket } from "../serverCommunication.js";

const useStyles = makeStyles({
  table: {
    maxWidth: 450,
  },
});

export default function waitForOthers(props) {
  const ws = getWebSocket();

  const classes = useStyles();

  const [redirect, setRedirect] = useState(false);
  const [question, setQuestion] = useState({
    _id: "",
    question: "",
    answer: "",
    category: "",
  });

  ws.onmessage = function (message) {
    const parsedMessage = JSON.parse(message.data);
    console.log("message received: " + parsedMessage.messageType);

    switch (parsedMessage.messageType) {
      case "ANSWERNEXTQUESTION":
        console.log("Get ready to answer the next question");
        const newQuestion = {
          _id: parsedMessage.question._id,
          question: parsedMessage.question.question,
          answer: parsedMessage.question.answer,
          category: parsedMessage.question.category,
        };
        setQuestion(newQuestion);

        props.handleCurrentQuizQuestion(question);
        setRedirect(true);
        break;

      default:
        console.log("Unknown messageType:", parsedMessage.messageType);
    }
  };

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/teams/${props.teamId}/question`,
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <h1>Waiting for other players</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell key="Question">Your answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell key="TeamAnswer">{props.teamAnswer}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
