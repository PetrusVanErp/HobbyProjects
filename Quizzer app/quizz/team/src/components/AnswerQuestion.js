import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { FormControl, TextField } from "@material-ui/core";

import { Redirect } from "react-router-dom";

import { getWebSocket } from "../serverCommunication.js"

const useStyles = makeStyles({
  table: {
    maxWidth: 450,
  },
});

export default function answerQuestion(props) {

  const ws = getWebSocket();
  const classes = useStyles();

  const [redirect, setRedirect] = useState(false);
  const [teamAnswer, setTeamAnswer] = useState("");
  const [alert, setAlert] = useState("");

  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    async function getQuiz() {
      await fetch(`http://localhost:4000/quizzes/${props.quizId}/`, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          setQuiz(data);
        });
    }
    getQuiz();
  }, []);


  async function handleOnClick() {
    let roomId = "";
    await fetch(`http://localhost:4000/quizzes/${props.quizId}/`, {
      method: 'get'
    }).then((response) => response.json())
      .then((data) => {
        roomId = data.room
      });


    await fetch(
      `http://localhost:4000/quizzes/${props.quizId}/teams/${props.teamId}/questions/answer`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: teamAnswer,
          roomId: roomId,
        }),
      }
    );

    props.handleTeamAnswer(teamAnswer);
  }

  ws.onmessage = function (message) {
    console.log(message)
    const parsedMessage = JSON.parse(message.data)
    console.log("message received: " + parsedMessage.messageType)

    switch (parsedMessage.messageType) {
      case "ANSWERPROCESSED":
        console.log("Your answer has been processed by the quizmaster")
        setRedirect(true);
        break;

      default: console.log("Unknown messageType:", parsedMessage.messageType);
    }
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/teams/${props.teamId}/waitingRoom`,
        }}
      />
    );
  }

  if (!quiz) {
    return (
      <React.Fragment>
        <h4>Searching for the quiz...</h4>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <h2>Question: </h2>
      {alert}
      <FormControl>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell key="Question">
                  {quiz.currentQuestion.question}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell key="TeamAnswer">
                  <TextField
                    value={teamAnswer}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setAlert(
                          <Alert severity="warning">
                            <AlertTitle>Warning</AlertTitle>
                            Your answer cannot be empty —{" "}
                            <strong>Please fill in a real answer!</strong>
                          </Alert>
                        );
                        return;
                      }
                      setTeamAnswer(e.target.value);
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Button color="primary" onClick={handleOnClick}>
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </FormControl>
    </React.Fragment>
  );
}

