import React, { useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "../css/Main.css";

import NewQuiz from "./NewQuiz";
import ChooseEntrants from "./ChooseEntrants";
import SelectCategories from "./SelectCategories";
import QuestionSelection from "./QuestionSelection";
import QuestionResults from "./QuestionResults";
import NotFound from "./NotFound";

function App(props) {
  const [teams, setTeams] = useState(null);
  const [categories, setCategories] = useState([]);
  const [question, setQuestion] = useState(null);
  const [quizId, setQuizId] = useState(0);
  const [round, setRound] = useState(null);

  function handleTeamsSelected(teams) {
    setTeams(teams);
  }

  function handleCategoriesSelected(categories) {
    setCategories(categories);
  }

  function handleQuestionSelected(newQuestion) {
    question === null ? setQuestion(newQuestion) : setQuestion(null);
  }

  function handleQuizIdSelected(quizId) {
    setQuizId(quizId);
  }

  function handleNewRound(round) {
    setRound(round);
  }

  function handleNextRound() {
    setCategories([])
    setQuestion(null);
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
                  <NewQuiz handleQuizIdSelected={handleQuizIdSelected} />
                )}
              />
              <Route
                exact
                path="/quizzes/:quizId/entrants"
                render={(params) => (
                  <ChooseEntrants
                    handleTeamsSelected={handleTeamsSelected}
                    quizId={quizId}
                    roomNr={params.location.state.roomNr}
                  />
                )}
              />
              <Route
                exact
                path="/quizzes/:quizId/categories"
                render={() => (
                  <SelectCategories
                    handleCategoriesSelected={handleCategoriesSelected}
                    teams={teams}
                    selectedCategories={categories}
                    quizId={quizId}
                    round={round}
                    handleNewRound={handleNewRound}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/quizzes/:quizId/questions"
                render={() => (
                  <QuestionSelection
                    handleQuestionSelected={handleQuestionSelected}
                    selectedQuestion={question}
                    categories={categories}
                    quizId={quizId}
                    round={round}
                  />
                )}
              />
              <Route
                exact
                path="/quizzes/:quizId/questions/:questionId/result"
                render={() => (
                  <QuestionResults
                    question={question}
                    quizId={quizId}
                    handleQuestionSelected={handleQuestionSelected}
                    handleNextRound={handleNextRound}
                  />
                )}
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
