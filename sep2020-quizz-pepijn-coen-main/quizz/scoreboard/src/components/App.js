import React, { useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "../css/Main.css";

import QuizInProgress from "./QuizInProgress";
import QuestionInProgress from "./QuestionInProgress";
import QuestionAnswered from "./QuestionAnswered";
import NotFound from "./NotFound";
import LinkToRoom from "./LinkToRoom";

function App(props) {

  const [scoreboardWs, setScoreboardWs] = useState(null);

  function handleScoreboardLink(ws) {
    setScoreboardWs(ws)
  }

  return (
    <React.Fragment>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <div className="app">
        <Router>
          <div className="app">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <LinkToRoom
                    handleScoreboardLink={handleScoreboardLink}
                  />
                )} />

              <Route
                exact
                path="/quizzes/:quizId"
                render={(routeProps) => (
                  <QuizInProgress
                    quizId={routeProps.match.params.quizId}
                    scoreboardWs={scoreboardWs}
                  />
                )}
              />
              <Route
                exact
                path="/quizzes/:quizId/questions"
                render={(routeProps) => <QuestionInProgress
                  quizId={routeProps.match.params.quizId}
                  scoreboardWs={scoreboardWs}
                />}
              ></Route>
              <Route
                exact
                path="/quizzes/:quizId/questions/answers"
                render={(routeProps) => <QuestionAnswered
                  quizId={routeProps.match.params.quizId}
                  scoreboardWs={scoreboardWs}
                />}
              />
              <Route>
                {" "}
                <NotFound></NotFound>{" "}
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </React.Fragment>
  );
}

export default App;
