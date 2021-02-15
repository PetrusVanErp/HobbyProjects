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

export default function totalScores(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <h1>Scores</h1>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="TeamName">TeamName</TableCell>
                            <TableCell key="Round1Points">Round1 Points</TableCell>
                            <TableCell key="Round1Correct">Round1 Correct</TableCell>
                            <TableCell key="Round2Points">Round2 Points</TableCell>
                            <TableCell key="Round2Correct">Round2 Correct</TableCell>
                            <TableCell key="TotalPoints">TotalPoints</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell key="TeamName">CoolTeamName</TableCell>
                            <TableCell key="Round1Points">4</TableCell>
                            <TableCell key="Round1Correct">4</TableCell>
                            <TableCell key="Round2Points">2</TableCell>
                            <TableCell key="Round2Correct">2</TableCell>
                            <TableCell key="TotalPoints">6</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell key="TeamName">NotSoCoolTeamName</TableCell>
                            <TableCell key="Round1Points">4</TableCell>
                            <TableCell key="Round1Correct">4</TableCell>
                            <TableCell key="Round2Points">4</TableCell>
                            <TableCell key="Round2Correct">4</TableCell>
                            <TableCell key="TotalPoints">8</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}