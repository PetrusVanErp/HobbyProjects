import React, { useState } from "react";

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
import { TextField } from "@material-ui/core";

import { Redirect } from "react-router-dom";

import { openWebSocket } from "../serverCommunication.js";

const useStyles = makeStyles({
  table: {
    maxWidth: 450,
  },
});

export default function teamApply(props) {
  const classes = useStyles();
  const randomstring = require("randomstring");

  const [redirect, setRedirect] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [roomNr, setRoomNr] = useState("");
  const [alert, setAlert] = useState("");

  function addMessage(msg) {
    if (typeof msg !== "string") {
      msg = JSON.stringify(msg);
    }
    console.log(msg);
  }

  async function teamNameAvailable() {
    let result = true;

    const quiz = await fetch(`http://localhost:4000/rooms/${roomNr}/`, {
      method: "get",
    }).then((response) => response.json());

    //No quiz was found
    if (!quiz) {
      setAlert(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          There was no quiz found with your room —{" "}
          <strong>Please try another room!</strong>
        </Alert>
      );
      result = false;
    }

    if (quiz) {
      quiz.teams.forEach((team) => {
        if (team.name === teamName) {
          setAlert(
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Your team name was already chosen by someone else—{" "}
              <strong>Please select a different team name!</strong>
            </Alert>
          );
          result = false;
        }
      });
    }
    return result;
  }

  async function handleOnClick() {
    if (teamName === "") {
      setAlert(
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Your team name cannot be empty —{" "}
          <strong>Please fill in your team name!</strong>
        </Alert>
      );
    }
    const available = await teamNameAvailable();
    if (!available) {
      return;
    }

    const userId = randomstring.generate();

    const ws = await openWebSocket("TEAM", userId, roomNr, teamName);
    ws.onerror = () => addMessage("WebSocket error");
    ws.onopen = () => {
      console.log("websocket created");
    };
    ws.onclose = () => addMessage("WebSocket connection closed");

    await fetch(`http://localhost:4000/rooms/${roomNr}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: teamName,
        userId: userId,
      }),
    });

    props.handleTeamApply(teamName);
    setRedirect(true);
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/rooms/${roomNr}`,
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <h1>Apply for a Quiz</h1>
      {alert}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell key="Team">Team</TableCell>
              <TableCell key="Room">Room</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell key="Team">
                <TextField
                  value={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                  }}
                  id="TeamName"
                />
              </TableCell>
              <TableCell key="Room">
                <TextField
                  value={roomNr}
                  onChange={(e) => {
                    setRoomNr(e.target.value);
                  }}
                  id="RoomNr"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Button color="primary" onClick={handleOnClick}>
                  Apply
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
