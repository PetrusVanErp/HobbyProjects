 
import React, { useState } from "react";

import Button from "@material-ui/core/Button";

import { Redirect } from "react-router-dom";

import { openWebSocket } from "../serverCommunication.js";

export default function newQuiz(props) {
  const randomstring = require("randomstring");

  const [redirect, setRedirect] = useState(false);
  const [quizId] = useState(randomstring.generate());
  const [roomNr] = useState(randomstring.generate());

  function addMessage(msg) {
    if (typeof msg !== "string") {
      msg = JSON.stringify(msg);
    }
    console.log(msg);
    console.log("in addMessage!");
  }

  async function handleOnClick() {
    const randomstring = require("randomstring");

    const userId = randomstring.generate();

    const ws = await openWebSocket("QUIZMASTER", userId, roomNr);
    ws.onerror = () => addMessage("WebSocket error");
    ws.onopen = () => {
      console.log("websocket created");
    };
    ws.onclose = () => addMessage("WebSocket connection closed");
    await fetch(`http://localhost:4000/quizzes/${quizId}/`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: roomNr,
      }),
    });
    props.handleQuizIdSelected(quizId);
    setRedirect(true);
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${quizId}/entrants`,
          state: { roomNr: roomNr }
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <h1>Welcome to Quizzer, the very great quiz app!</h1>
      <Button variant="contained" color="primary" onClick={handleOnClick}>
        Start a new quiz
      </Button>
    </React.Fragment>
  );
}

 
