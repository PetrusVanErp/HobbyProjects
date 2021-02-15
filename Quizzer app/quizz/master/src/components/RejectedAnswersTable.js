import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    maxWidth: 450,
  },
});

export default function rejectedAnswersTable(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key="Team">Team</TableCell>
            <TableCell key="RejectedAnswer">Answer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.answers.teams.map((team) => {
            return (
              <TableRow key={team.name}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.answer}</TableCell>
              </TableRow>
              
            );
          })}
        </TableBody>
      </Table>
      </TableContainer>
    </React.Fragment>
  );
}