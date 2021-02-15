import React from "react";

import {bindActionCreators} from "redux";
import {logIn, redirect, webSocket} from "../actions";
import {getWebSocket} from '../websockets/serverCommunication';
import {connect} from "react-redux";
import {createUser, userNameAvailable} from "../components/helpers/RegisterComponentHelper"

import {makeStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
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
    registerContainer: {
        order: 1,
        float: 'middle',
        width: '500px',
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
    register: {
        float: 'left',
        margin: theme.spacing(2, 0, 0)
    },
    registerTextField: {
        marginTop: '10px'
    },
    firstNameInput: {
        float: 'left',
        width: '200px'
    },
    lastNameInput: {
        float: 'right',
        width: '200px'
    },
}))

function RegisterComponent(props) {
    const classes = useStyles()
    const standardNotificationTemp = "You must enter a "

    const [formData, updateFormData] = React.useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [invalidForm, setInvalidForm] = React.useState(false)

    const [userMessage, setUserMessage] = React.useState("")

    const handleChange = (e) => {
        updateFormData({
            ...formData,

            // Trimming any whitespace
            [e.target.name]: e.target.value.trim()
        })
    }

    async function checkUserName(userJson) {
        return await userNameAvailable(userJson)
    }

    async function onRegisterClicked() {

        if(props.webSocket){
            props.webSocket(getWebSocket())
        }


        if(formData.password !== formData.confirmPassword){
            alert("Passwords do not match!")
            return
        }

        const jsonData = {
            "name": formData.firstname + ' ' + formData.lastname,
            "username": formData.username,
            "hashed_password": md5(formData.password),
            "email": formData.email
        }

        if (await checkUserName(jsonData)) {
            setUserMessage("This username already exists!")
            setInvalidForm(true)
        } else if (formData.firstname === "" || formData.lastname === "" || formData.username === "" || formData.password === "" || formData.confirmPassword === "" || formData.email === "") {
            setInvalidForm(true)
            if (formData.username === "") {
                setUserMessage(standardNotificationTemp + "username!")
            }
        } else {
            const user = await createUser(jsonData)

            props.logIn(user)
            props.redirect("HOMEPAGE")

        }
    }

    return (
        <React.Fragment>
            <main>
                <div className={classes.heroContent}>
                    <Container>
                        <Typography component="h4" name="register" variant="h4" align="center" color="textPrimary" gutterBottom>
                            Register
                        </Typography>
                    </Container>
                </div>
                <FormControl className={classes.newPlaylistForm}>
                    <Container className={classes.flexContainer}>
                        <Container className={classes.registerContainer}>
                            <Typography>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <br></br>
                                        <TextField
                                            error={invalidForm && formData.firstname === ""}
                                            className={classes.firstNameInput}
                                            autoComplete="given-name"
                                            name="firstname"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            autoFocus
                                            label="First name"
                                            onChange={handleChange}
                                            helperText={invalidForm && formData.firstname === "" ? standardNotificationTemp +  "firstname!" : ""}
                                        />
                                        <TextField
                                            error={invalidForm && formData.lastname === ""}
                                            className={classes.lastNameInput}
                                            autoComplete="family-name"
                                            name="lastname"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Last name"
                                            onChange={handleChange}
                                            helperText={invalidForm && formData.lastname === "" ? standardNotificationTemp + "lastname!" : ""}
                                        />
                                        <TextField
                                            error={invalidForm}
                                            className={classes.registerTextField}
                                            autoComplete="username"
                                            name="username"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Username"
                                            onChange={handleChange}
                                            helperText={invalidForm ? userMessage : ""}
                                        />
                                        <TextField
                                            error={invalidForm && formData.email === ""}
                                            className={classes.registerTextField}
                                            autoComplete="email"
                                            name="email"
                                            variant="outlined"
                                            required
                                            type="mail"
                                            fullWidth
                                            label="E-mail"
                                            onChange={handleChange}
                                            helperText={invalidForm && formData.email === "" ? standardNotificationTemp + "email!" : ""}
                                        />
                                        <TextField
                                            error={invalidForm && formData.password === ""}
                                            className={classes.registerTextField}
                                            autoComplete="new-password"
                                            name="password"
                                            type="password"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Password"
                                            onChange={handleChange}
                                            helperText={invalidForm && formData.password === "" ? standardNotificationTemp + "password!" : ""}
                                        />
                                        <TextField
                                            error={invalidForm && formData.password === ""}
                                            className={classes.registerTextField}
                                            autoComplete="new-password"
                                            name="confirmPassword"
                                            type="password"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            label="Confirm password"
                                            onChange={handleChange}
                                            helperText={invalidForm && formData.password === "" ? standardNotificationTemp + "password!" : ""}
                                        />
                                        <Button variant="contained" color="primary" name="registerButton" className={classes.register}
                                            onClick={onRegisterClicked}>
                                            Register
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
    return {
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ redirect: redirect, logIn: logIn, webSocket: webSocket }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(RegisterComponent);
