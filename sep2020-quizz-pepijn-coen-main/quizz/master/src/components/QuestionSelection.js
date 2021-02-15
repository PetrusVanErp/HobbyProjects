import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Button from "@material-ui/core/Button";

import SelectedCategoriesPanel from "./SelectedCategoriesPanel";
import QuestionSelectionPanel from "./QuestionSelectionPanel";

import { getWebSocket } from "../serverCommunication.js"

export default function QuestionSelection(props) {
  const ws = getWebSocket();

  const [redirect, setRedirect] = useState(false);

  async function handleOnClick() {
    console.log("Selected question: ", props.selectedQuestion._id)
    await fetch(`http://localhost:4000/quizzes/${props.quizId}/questions/${props.selectedQuestion._id}`, {
      method: 'post'
    })

    let nextQuestionMessage = {
      messageType: "NEXTQUESTION",
      quizId: props.quizId,
      question: props.selectedQuestion
    }
    ws.send(JSON.stringify(nextQuestionMessage))

    setRedirect(true);
  }

  if (redirect) {
    return <Redirect to={`/quizzes/${props.quizId}/questions/${props.selectedQuestion._id}/result`} />;
  }

  return (
    <div className="QuestionSelection">
      <h1>Select your question</h1>
      <div className="SelectedCategoriesPanel">
        <h2>Your categories</h2>
        <SelectedCategoriesPanel
          categories={props.categories}
          quizId={props.quizId}
        ></SelectedCategoriesPanel>
      </div>
      <div className="QuestionSelectionPanel">
        <h2>Choose one question</h2>
        <QuestionSelectionPanel
          handleOnClick={props.handleQuestionSelected}
          categories={props.categories}
          selectedQuestion={props.selectedQuestion}
          quizId={props.quizId}
        ></QuestionSelectionPanel>
      </div>
      <hr></hr>
      <Button disabled={props.selectedQuestion ? false : true} variant="contained" color="primary" onClick={handleOnClick}>
        Next
      </Button>
    </div>
  );
}
