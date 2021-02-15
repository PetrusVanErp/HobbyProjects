import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "../css/Main.css";

import TeamApply from "./TeamApply";
import AnswerQuestion from "./AnswerQuestion";
import WaitForOthers from "./WaitForOthers";
import WaitForQuizMaster from "./WaitForQuizMaster";
import NotFound from "./NotFound";

function App(props) {

    const [teamAnswer, setTeamAnswer] = useState("");
    const [teamName, setTeamName] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState({
        _id: '',
        question: '',
        answer: '',
        category: ''
    });

    function handleTeamApply(teamName) {
        setTeamName(teamName);
    }

    function handleTeamAnswer(teamAnswer) {
        setTeamAnswer(teamAnswer);
    }

    function handleCurrentQuizQuestion(currentQuestion) {
        const newQuestion = {
            _id: currentQuestion._id,
            question: currentQuestion.question,
            answer: currentQuestion.answer,
            category: currentQuestion.category
        }
        setCurrentQuestion(newQuestion);
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
                                    <TeamApply
                                        handleTeamApply={handleTeamApply}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/rooms/:roomId"
                                render={(routeProps) => (
                                    <WaitForQuizMaster 
                                    roomId={routeProps.match.params.roomId}
                                    teamName={teamName}
                                    handleCurrentQuizQuestion={handleCurrentQuizQuestion} />
                                )}
                            />
                            <Route
                                exact
                                path="/quizzes/:quizId/teams/:teamId/question"
                                render={(routeProps) => (
                                    <AnswerQuestion
                                        handleTeamAnswer={handleTeamAnswer}
                                        teamName={teamName}
                                        quizId={routeProps.match.params.quizId}
                                        teamId={routeProps.match.params.teamId}
                                        currentQuestion={currentQuestion}
                                    />
                                )}
                            ></Route>
                            <Route
                                exact
                                path="/quizzes/:quizId/teams/:teamId/waitingRoom"
                                render={(routeProps) => (
                                    <WaitForOthers
                                        teamAnswer={teamAnswer}
                                        quizId={routeProps.match.params.quizId}
                                        teamId={routeProps.match.params.teamId}
                                        handleCurrentQuizQuestion={handleCurrentQuizQuestion}
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
    )
}

export default App
