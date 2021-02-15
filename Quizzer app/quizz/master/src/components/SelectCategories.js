import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";

import CategoriesSelectionPanel from "./CategoriesSelectionPanel";
import SelectedCategoriesPanel from "./SelectedCategoriesPanel";
import AcceptedEntrantsTable from "./AcceptedEntrantsTable";

export default function SelectCategories(props) {
  const [redirect, setRedirect] = useState(false);
  const [categories, setCategories] = useState([]);

  async function handleOnClick(e) {
    await newRound();
    setRedirect(true);
  }

  async function newRound() {
    return await fetch(`http://localhost:4000/quizzes/${props.quizId}/rounds`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categories: props.selectedCategories,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        props.handleNewRound(data);
      });
  }

  useEffect(() => {
    async function getCategories() {
      return await fetch(`http://localhost:4000/questions/categories`, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          setCategories(data);
        });
    }

    getCategories();
  }, []);

  function handleCategorySelect(category) {
    if (props.selectedCategories.includes(category)) {
      props.handleCategoriesSelected(
        props.selectedCategories.filter((c) => c !== category)
      );
      return;
    }

    let newState = props.selectedCategories.slice();
    newState.push(category);
    props.handleCategoriesSelected(newState);
  }

  if (redirect)
    return (
      <Redirect
        to={{
          pathname: `/quizzes/${props.quizId}/questions`,
        }}
      />
    );
  else
    return (
      <div className="SelectCategories">
        <h1>Select three categories</h1>
        <h2>Teams</h2>
        <AcceptedEntrantsTable
          entrants={{ teams: props.teams }}
        ></AcceptedEntrantsTable>
        <hr></hr>
        <div className="CategoriesSelectionPanel">
          <h2>Categories</h2>
          <CategoriesSelectionPanel
            categories={categories}
            selectedCategories={props.selectedCategories}
            handleOnClick={handleCategorySelect}
          ></CategoriesSelectionPanel>
        </div>
        <hr></hr>
        <div className="SelectedCategoriesPanel">
          <h2>Selected categories</h2>
          <SelectedCategoriesPanel
            categories={props.selectedCategories}
          ></SelectedCategoriesPanel>
        </div>
        <hr></hr>
        <Button
          disabled={props.selectedCategories.length === 3 ? false : true}
          variant="contained"
          color="primary"
          onClick={handleOnClick}
        >
          Start round
        </Button>
      </div>
    );
}
