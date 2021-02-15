import React from "react";

import Button from "@material-ui/core/Button";
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
    maxWidth: 650,
  },
});

export default function NewEntrantsTable(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key="Team">Team</TableCell>
            <TableCell key="Allow">Accept</TableCell>
            <TableCell key="Remove">Reject</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.entrants.teams.map((entrant) => {
            if (entrant.status != null) {
              //Team still has to be accepted or rejected when status is null
              return null;
            }
            return (
              <TableRow  key={entrant.name}>
                <TableCell>{entrant.name}</TableCell>
                <TableCell>
                  
                <Button color="primary" onClick={(e) => props.onAccept(e, entrant)}>
                    Accept
                  </Button>
                </TableCell>
                <TableCell>
                  <Button color="secondary" onClick={(e) => props.onReject(e, entrant)}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow >
            );
          })}
        </TableBody>
      </Table>
      </TableContainer>
      <hr></hr>
    </React.Fragment>
  );
}
