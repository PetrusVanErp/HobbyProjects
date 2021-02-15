import React, { useState } from "react";

import Button from "@material-ui/core/Button";

import NewEntrantsTable from "./NewEntrantsTable";
import AcceptedEntrantsTable from "./AcceptedEntrantsTable";
import { Redirect } from "react-router-dom";

import { getWebSocket } from "../serverCommunication.js";

export default function ChooseEntrants(props) {
  const ws = getWebSocket();

  const [newEntrants, setNewEntrants] = useState({
    teams: [],
  });
  const [acceptedEntrants, setAcceptedEntrants] = useState({ teams: [] });
  const [redirect, setRedirect] = useState(false);

  async function handleTeamAccept(e, team) {
    await fetch(
      `http://localhost:4000/quizzes/${props.quizId}/teams/${team.name}`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: team.userId,
        }),
      }
    );

    const newState = { ...acceptedEntrants };
    newState.teams.push(team);
    setAcceptedEntrants({ teams: newState.teams });

    const newEntrantsState = { ...newEntrants };
    newEntrantsState.teams.forEach((element) => {
      if (element.name === team.name) {
        element.status = "handled";
      }
    });
    setNewEntrants(newEntrantsState);
  }

  async function handleTeamRejected(e, team) {
    await fetch(
      `http://localhost:4000/quizzes/${props.quizId}/teams/${team.name}`,
      {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: team.userId,
        }),
      }
    );

    const newEntrantsState = { ...newEntrants };
    newEntrantsState.teams.forEach((element) => {
      if (element.name === team.name) {
        element.status = "handled";
      }
    });
    setNewEntrants(newEntrantsState);

    const entrantRejectMessage = {
      messageType: "ENTRANTREJECTED",
    };
    ws.send(JSON.stringify(entrantRejectMessage));
  }

  function handleOnClick(e) {
    console.log(acceptedEntrants);
    props.handleTeamsSelected(acceptedEntrants.teams);
    setRedirect(true);
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/categories`,
        }}
      />
    );
  }

  ws.onmessage = function(message) {
    console.log(message)
    const parsedMessage = JSON.parse(message.data)
    console.log("message received: " + parsedMessage);
    switch (parsedMessage.messageType) {
      case "TEAMAPPLY":
        console.log(
          "Team " +
            parsedMessage.teamName +
            " wants to join your quiz" +
            parsedMessage.userId
        );
        const newEntrant = {
          name: parsedMessage.teamName,
          status: null,
          userId: parsedMessage.userId,
        };

        const newState = { ...newEntrants };
        newState.teams.push(newEntrant);
        setNewEntrants(newState);
        break;

      default:
        console.log("Unknown messageType:", parsedMessage.messageType);
    }
  };

  return (
    <div className="ChooseEntrants">
      <h1>The entrants page</h1>
      <h2>Your Room:</h2>
      Invite teams with the room code: <h4>{props.roomNr}</h4>
      <div className="NewEntrants">
        <h2>Entrants</h2>
        <NewEntrantsTable
          entrants={newEntrants}
          onAccept={handleTeamAccept}
          onReject={handleTeamRejected}
        ></NewEntrantsTable>
      </div>
      <div className="AcceptedEntrants">
        <h2>Accepted teams</h2>
        <AcceptedEntrantsTable
          entrants={acceptedEntrants}
        ></AcceptedEntrantsTable>
      </div>
      <hr></hr>
      <Button
        disabled={acceptedEntrants.teams.length > 0 ? false : true}
        variant="contained"
        color="primary"
        onClick={handleOnClick}
      >
        Start quiz
      </Button>
    </div>
  );
}
