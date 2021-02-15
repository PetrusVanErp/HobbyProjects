"use strict";

const mongoose = require("mongoose");
const dbName = "Quizzer";

const express = require("express");
const cors = require("cors"); // needed for using webpack-devserver with express server
const bodyParser = require("body-parser");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const userRouter = require("./routes/user.js");
const roomRouter = require("./routes/room.js");
const roundRouter = require("./routes/round.js");
const quizRouter = require("./routes/quiz.js");
const questionRouter = require("./routes/question.js");
const quizQuestionRouter = require("./routes/quizQuestion.js");

const teamClients = [];
const quizMasterClients = [];
const scoreboardClients = [];

// needed to make all requests from client work with this server.
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));

app.use(bodyParser.json());

// Setup for the user login and logout
app.use("/", userRouter);

// Setup for interaction with a quiz room
app.use("/rooms", roomRouter);

// Setup for interaction with rounds
app.use("/quizzes", roundRouter);

// Setup for interaction with the quiz
app.use("/quizzes", quizRouter);

// Setup for interaction with questions
app.use("/questions", questionRouter);

// Setup for interaction with questions of a certain quiz
app.use("/quizzes", quizQuestionRouter);

// Create HTTP server by ourselves, in order to attach websocket server.
const httpServer = http.createServer(app);

// Create the Web socket server.
const websocketServer = new WebSocket.Server({ noServer: true });

httpServer.on("upgrade", (req, networkSocket, head) => {
  // Everything is fine. We tell the websocket server to
  // initiate a new websocket connection for this request
  // and emit a new connection event passing in the
  // newly created websocket when the setup is complete
  websocketServer.handleUpgrade(req, networkSocket, head, (newWebSocket) => {
    websocketServer.emit("connection", newWebSocket, req);
  });
});

websocketServer.on("connection", (socket, req) => {
  console.log("=====================================================");
  console.log("WEBSOCKET: connection created");

  //TODO split req.url
  const urlSplit = req.url.split("/");
  const type = urlSplit[1];
  const userId = urlSplit[2];
  const roomId = urlSplit[3];
  const teamName = urlSplit[4];

  console.log("=====================================================");
  console.log(req.url);
  console.log(type);
  console.log(userId);
  console.log(roomId);
  console.log("=====================================================");

  if (type === "TEAM") {
    teamClients.push({
      socket: socket,
      userId: userId,
      roomId: roomId,
      teamId: teamName,
    });
  } else if (type === "QUIZMASTER") {
    quizMasterClients.push({
      socket: socket,
      userId: userId,
      roomId: roomId,
    });
  } else if (type === "SCOREBOARD") {
    scoreboardClients.push({
      socket: socket,
      userId: userId,
      roomId: roomId,
    });
  }

  socket.on("message", (message) => {
    console.log("WEBSOCKET: message received");

    var parsedMessage = JSON.parse(message);
    console.log("Socket parsed message arrived!", parsedMessage);
    switch (parsedMessage.messageType) {
      case "NEXTQUESTION":
        console.log("Get ready to answer the next question!");
        let answerNextQuestionMessage = {
          messageType: "ANSWERNEXTQUESTION",
          quizId: parsedMessage.quizId,
          question: parsedMessage.question,
        };

        websocketServer.clients.forEach(function (client) {
          client.send(JSON.stringify(answerNextQuestionMessage));
        });
        break;
      default:
        console.log(
          "WEBSOCKET: Unknown messageType:",
          parsedMessage.messageType
        );
    }

    // broadcast this message to all connected browsers
    const outMessage = message;
    websocketServer.clients.forEach(function (client) {
      client.send(outMessage);
    });
  });
});

//
// Start the server.
const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  mongoose.connect(
    `mongodb://localhost:27017/${dbName}`,
    { useNewUrlParser: true },
    () => {
      console.log(
        `mongoDB server started on port ${httpServer.address().port}`
      );
    }
  );
});

module.exports = { teamClients, quizMasterClients, scoreboardClients };
