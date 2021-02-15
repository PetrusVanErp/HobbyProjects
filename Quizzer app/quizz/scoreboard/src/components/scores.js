import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    maxWidth: 450,
  },
});

const style = {
  1: {
    background: "yellow",
  },
  2: {
    background: "grey",
  },
  3: {
    background: "brown",
  },
};

export default function Scores(props) {
  const classes = useStyles();

  let teamPlacing = 0;

  function getPlacingStyling() {
    teamPlacing = teamPlacing + 1;
    return style[teamPlacing];
  }

  if (!props.currentQuiz || !props.scores) {
    return (
      <React.Fragment>
        <h4>Searching for the quiz...</h4>
      </React.Fragment>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key="TeamName">TeamName</TableCell>
            {props.scores.roundScores.map((round) => {
              return (
                <React.Fragment>
                  <TableCell key={round.name + "Correct"}>
                    {round.name} Correct
                  </TableCell>
                  <TableCell key={round.name + "Points"}>
                    {round.name} Points
                  </TableCell>
                </React.Fragment>
              );
            })}
            <TableCell key="TotalPoints">TotalPoints</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.scores.teams
            .sort((a, b) => a.score < b.score)
            .map((team, index) => {
              const roundScores = props.scores.roundScores.map((round) => {
                return round.scores
                  .filter((score) => score._id === team.name)
                  .map((results) => {
                    return (
                      <React.Fragment>
                        <TableCell>
                          {results.totalCorrect}
                        </TableCell>
                        <TableCell>
                          {results.score}
                        </TableCell>
                      </React.Fragment>
                    );
                  });
              });
              return (
                <React.Fragment key={index}>
                  <TableRow key={index} style={teamPlacing < 4 ? getPlacingStyling() : ""}>
                    <TableCell key="TeamName">{team.name}</TableCell>
                    {roundScores}
                    <TableCell key="TotalPoints">{team.score}</TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
