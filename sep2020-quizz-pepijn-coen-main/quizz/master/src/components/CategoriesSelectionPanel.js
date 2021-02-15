import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: "600px",
  },
});

export default function CategoriesSelectionPanel(props) {
  const classes = useStyles();

  function handleOnClick(e, category) {
    props.handleOnClick(category);
  }

  return (
    <div className={classes.root}>
      {props.categories.map((category) => {
        return (
          <Accordion key={category}>
            <AccordionSummary
              aria-controls="additional-actions2-content"
              id="additional-actions2-header"
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={
                  props.selectedCategories.length >= 3 &&
                  !props.selectedCategories.includes(category) ? (
                    <Checkbox disabled />
                  ) : (
                    <Checkbox onClick={(e) => handleOnClick(e, category)} />
                  )
                }
                label={category}
              />
            </AccordionSummary>
          </Accordion>
        );
      })}
    </div>
  );
}
