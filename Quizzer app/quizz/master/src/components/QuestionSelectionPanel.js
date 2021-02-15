import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: "600px",
    maxHeight: "500px",
    overflow: "auto",
  },
});

export default function QuestionSelectionPanel(props) {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [appearedQuestions, setAppearedQuestions] = useState([]);

  function handleOnClick(e, question) {
    props.handleOnClick(question);
  }

  useEffect(() => {
    async function getAlreadyAppearedQuestions() {
      const fetchString = `http://localhost:4000/quizzes/${props.quizId}/questions/`;
      return await fetch(fetchString, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          setAppearedQuestions(data);
        });
    }

    async function getQuestions() {
      //TODO: Beautify this
      const category1 = props.categories[0];
      const category2 = props.categories[1];
      const category3 = props.categories[2];
      const fetchString = `http://localhost:4000/questions?category1=${category1}&category2=${category2}&category3=${category3}`;

      return await fetch(fetchString, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          setQuestions(data);
        });
    }
    getAlreadyAppearedQuestions();
    getQuestions();
  }, []);

  return (
    <div className={classes.root}>
      {questions
        .filter((question) => props.categories.includes(question.category)).filter(question => {
          return !appearedQuestions.includes(question._id)
        })
        .map((question) => {
          return (
            <Accordion key={question._id}>
              <AccordionSummary
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
                <FormControlLabel
                  aria-label="Acknowledge"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    props.selectedQuestion &&
                    !(props.selectedQuestion.question === question.question) ? (
                      <Checkbox disabled />
                    ) : (
                      <Checkbox onClick={(e) => handleOnClick(e, question)} />
                    )
                  }
                  label={question.question}
                />
              </AccordionSummary>
            </Accordion>
          );
        })}
    </div>
  );
}
