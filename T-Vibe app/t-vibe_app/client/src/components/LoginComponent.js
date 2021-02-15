import React from "react";

import { loginClicked } from "../components/helpers/LoginComponentHelper"
import {bindActionCreators} from "redux";
import {logIn, redirect, webSocket} from "../actions";
import { getWebSocket } from '../websockets/serverCommunication';
import {connect} from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const md5 = require('md5')

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 3),
        margin: theme.spacing(0, 0, 3)
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    loginContainer: {
        order: 1,
        float: 'middle',
        width: '400px',
        paddingBottom: '30px'
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    newPlaylistForm: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(0, 0, 5)
    },
    login: {
        float: 'right',
        margin: theme.spacing(5, 0, 0)
    },
    loginTextField: {
        paddingTop: '5px'
    },
    loginFormLabel: {
        float: 'left',
        paddingTop: '5px'
    },
    registerLink: {
        color: 'blue',
        float: 'left',
        paddingTop: '5px',
        fontSize: '0.9em'
    }
}))


function LoginComponent(props) {
    const classes = useStyles()
    const [formData, updateFormData] = React.useState({
        username: "",
        password: ""
    })

    const handleChange = (e) => {
        updateFormData({
            ...formData,

            // Trimming any whitespace
            [e.target.name]: e.target.value.trim()
        })
    }

    async function getFollowing(following, ws){
        following.forEach(async (follower) => {
            await fetch(`http://localhost:3001/users/${follower}`, {
            method: "get",
            headers: { "Content-Type": "application/json" }
        }).then((response) => response.json())
            .then((user) => {
                const followingMessage = {
                    type: "FOLLOWING_MESSAGE",
                    username: user.username
                }
                ws.send(JSON.stringify(followingMessage))
            })
        })
    }

    async function onLoginClicked(e) {

        let ws = getWebSocket()

        const loginMessage = {
            type: "LOGIN_MESSAGE",
            username: formData.username
        }

        const jsonData = {
            "username": formData.username,
            "hashed_password": md5(formData.password),
        }

        const user = await loginClicked(jsonData)

        ws.send(JSON.stringify(loginMessage))

        if(props.webSocket){
            props.webSocket(ws)
        }
        props.logIn(user)
        props.redirect("HOMEPAGE")

        await getFollowing(user.following, ws)    

    }

    return (
        <React.Fragment>
            <main>
                <div className={classes.heroContent}>
                    <Container>
                        <Typography component="h4" variant="h4" align="center" color="textPrimary" name="login" gutterBottom>
                            Login
                        </Typography>
                    </Container>
                </div>
                <FormControl className={classes.newPlaylistForm}>
                    <Container className={classes.flexContainer}>
                        <Container className={classes.loginContainer}>
                            <Typography>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <FormLabel className={classes.loginFormLabel}>Username</FormLabel>
                                        <TextField
                                            className={classes.loginTextField}
                                            autoComplete="username"
                                            name="username"
                                            placeholder="Fill in your username"
                                            variant="outlined"
                                            onInput={handleChange}
                                            fullWidth
                                            autoFocus
                                        />
                                        <br></br>
                                        <FormLabel className={classes.loginFormLabel}>Password</FormLabel><br></br>
                                        <TextField
                                            className={classes.loginTextField}
                                            autoComplete="password"
                                            name="password"
                                            placeholder="Fill in your password"
                                            type="password"
                                            variant="outlined"
                                            onInput={handleChange}
                                            fullWidth
                                        />
                                        <FormLabel className={classes.loginFormLabel}> <a href="#" name="registerLink"
                                            onClick={() => props.redirect("REGISTER")}
                                            className={classes.registerLink}>
                                            Register for an account here
                                        </a>
                                        </FormLabel>
                                        <Button variant="contained" color="primary" className={classes.login} name="loginButton"
                                            onClick={onLoginClicked}>
                                            Login
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Typography>
                        </Container>
                    </Container>
                </FormControl>
            </main>
        </React.Fragment>
    )
}


function mapStateToProps(state) {
    return {}
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({redirect: redirect, logIn: logIn, webSocket: webSocket}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(LoginComponent);
