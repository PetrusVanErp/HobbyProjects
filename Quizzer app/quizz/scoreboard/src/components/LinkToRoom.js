import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { Redirect } from "react-router-dom";

import { openWebSocket } from "../serverCommunication.js";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles({
    table: {
        maxWidth: 450,
    },
});

export default function linkToRoom(props) {
    const classes = useStyles();

    const [roomNr, setRoomNr] = useState("");
    const [alert, setAlert] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [quiz, setQuiz] = useState({})

    const randomstring = require("randomstring");

    async function handleOnClick() {
        if (roomNr === "") {
            setAlert(
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
              The roomNr cannot be empty —{" "}
                    <strong>Please fill in the correct roomNr!</strong>
                </Alert>
            );
        }

        const userId = randomstring.generate();

        const ws = await openWebSocket("SCOREBOARD", userId, roomNr, userId);
        ws.onerror = () => console.log("WebSocket error");
        ws.onopen = () => {
            console.log("websocket created");
        };
        ws.onclose = () => console.log("WebSocket connection closed");

        const quizInRoom = await fetch(`http://localhost:4000/rooms/${roomNr}/`, {
            method: "get",
        }).then((response) => response.json());

        //No quiz was found
        if (!quizInRoom) {
            setAlert(
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
            There was no quiz found with this roomNr —{" "}
                    <strong>Please try another room!</strong>
                </Alert>
            );
        } else {
            console.log("WSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: " + ws)
            props.handleScoreboardLink(ws)
            setQuiz(quizInRoom)
        }

        setRedirect(true);
    }

    if (redirect) {
        return (
            <Redirect
                to={{
                    pathname: `/quizzes/${quiz._id}`,
                }}
            />
        );
    }

    return (
        <React.Fragment>
            <h1>Link to a quiz</h1>
            {alert}
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow key="RoomNr">
                            <TableCell>RoomNr</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key="RoomNr">
                            <TableCell>
                                <TextField value={roomNr}
                                    onChange={(e) => {
                                        setRoomNr(e.target.value);
                                    }}
                                    id="RoomNr"></TextField>
                            </TableCell>
                            <TableCell>
                                <Button color="primary" onClick={handleOnClick}>
                                    Apply
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}
