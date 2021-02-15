import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { getWebSocket } from "../serverCommunication.js";

export default function waitForQuizMaster(props) {
  const ws = getWebSocket();

  const [redirectAccepted, setRedirectAccepted] = useState(false);
  const [redirectRejected, setRedirectRejected] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [question, setQuestion] = useState({
    _id: "",
    question: "",
    answer: "",
    category: "",
  });

  if (redirectAccepted) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${quizId}/teams/${props.teamName}/question`,
        }}
      />
    );
  }

  if (redirectRejected) {
    return (
      <Redirect
        to={{
          pathname: `/`,
        }}
      />
    );
  }

  ws.onmessage = function (message) {
    const parsedMessage = JSON.parse(message.data);
    console.log("message received: " + parsedMessage.messageType);

    const quizMasterResponseDiv = document.getElementById("quizMasterResponse");

    switch (parsedMessage.messageType) {
      case "ENTRANTACCEPTED":
        console.log("Websocket message received: ENTRANTACCEPTED");

        let acceptedDiv = document.createElement("div");
        acceptedDiv.className = "accepted";
        acceptedDiv.innerHTML =
          "You got accepted. Please wait for the quizmaster to start the quiz";
        quizMasterResponseDiv.appendChild(acceptedDiv);
        break;
      case "ENTRANTREJECTED":
        if (props.teamName === parsedMessage.team) {
          console.log("Websocket message received: ENTRANTREJECTED");
          console.log(parsedMessage);
          let rejectedDiv = document.createElement("div");
          rejectedDiv.className = "rejected";
          rejectedDiv.innerHTML = "You got rejected";

          ws.close();

          setRedirectRejected(true);
        }
        break;
      case "ANSWERNEXTQUESTION":
        console.log("Get ready to answer the next question");
        setQuizId(parsedMessage.quizId);
        const newQuestion = {
          _id: parsedMessage.question._id,
          question: parsedMessage.question.question,
          answer: parsedMessage.question.answer,
          category: parsedMessage.question.category,
        };
        setQuestion(newQuestion);

        props.handleCurrentQuizQuestion(question);
        setRedirectAccepted(true);
        break;

      default:
        console.log("Unknown messageType:", parsedMessage.messageType);
    }
  };

  return (
    <div className="WaitForQuizMaster">
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;900&display=swap"
        rel="stylesheet"
      />
      <div className="mainbox">
        <div className="msg">
          Waiting for the quizmaster to accept or reject your application
        </div>
        <div id="quizMasterResponse"></div>
      </div>
    </div>
  );
}
