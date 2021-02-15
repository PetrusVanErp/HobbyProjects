import React, {useState} from "react";

import {saveChanges} from "../components/helpers/EditProfileComponentHelper";
import {logIn, redirect} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';

const md5 = require('md5')

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 2),
    },
    enabledButton: {
        display: 'block',
        marginLeft: '15px'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftFlexItem: {
        order: 1,
        paddingBottom: '30px'
    },
    middleFlexItem: {
        order: 2
    },
    cardContent: {
        maxHeight: '600px'
    },
    card: {
        height: '100%',
        width: '100%',
        display: 'inline-block',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    profileTitle: {
        textAlign: "left",
        paddingLeft: "15px"
    },
}))

function EditProfileComponent(props) {
    const classes = useStyles()
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [invalidForm, setInvalidForm] = useState(false)
    const [userMessage, setUserMessage] = React.useState("")

    function handleOldPasswordChange(e) {
        setOldPassword(e.target.value)
    }
    function handleNewPasswordChange(e) {
        setNewPassword(e.target.value)
    }
    function handleConfirmedPasswordChange(e) {
        setConfirmedPassword(e.target.value)
    }

    async function onSaveChangesClicked(e) {
        e.preventDefault()

        if(md5(oldPassword) !== props.activeUser.hashed_password) {
            setInvalidForm(true)
            setUserMessage("Wrong password!")
            return
        }
        if(newPassword !== confirmedPassword){
            setInvalidForm(true)
            setUserMessage("New passwords do not match!")
            return
        }
        if(md5(newPassword) === props.activeUser.hashed_password){
            setInvalidForm(true)
            setUserMessage("Your new password cannot be the same as your old password!")
            return
        }

        const updatedUserBody = {
            hashed_password: md5(newPassword),
        }

        const user = await saveChanges(props.activeUser._id, updatedUserBody)

        props.logIn(user)
        props.redirect("MY_PROFILE")
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.heroContent}>
                    <Container>
                        <Container className={classes.flexContainer}>
                            <Container className={classes.leftFlexItem}>
                                <Card>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://source.unsplash.com/random"
                                        title="Image title"
                                    />
                                </Card>
                            </Container>
                            <Container className={classes.middleFlexItem}>
                                <Card className={classes.card} variant="outlined">
                                    <CardContent className={classes.cardContent}>
                                        <Typography className={classes.profileTitle} variant="h2" name="editPassword" color="textPrimary">
                                            Edit password
                                        </Typography>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <TextField
                                                    error={invalidForm && userMessage === "Wrong password!"}
                                                    label="Old password"
                                                    autoComplete="password"
                                                    type="password"
                                                    name="oldPassword"
                                                    variant="outlined"
                                                    value={oldPassword}
                                                    onChange={(e) => handleOldPasswordChange(e)}
                                                    helperText={invalidForm && userMessage === "Wrong password!" ? userMessage : ""}
                                                    fullWidth
                                                />
                                            </Typography>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <TextField
                                                    error={invalidForm && userMessage === "Your new password cannot be the same as your old password!"}
                                                    label="New password"
                                                    autoComplete="password"
                                                    type="password"
                                                    name="newPassword"
                                                    variant="outlined"
                                                    value={newPassword}
                                                    onChange={(e) => handleNewPasswordChange(e)}
                                                    helperText={invalidForm && userMessage === "Your new password cannot be the same as your old password!" ? userMessage : ""}
                                                    fullWidth
                                                />
                                            </Typography>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <TextField
                                                    error={invalidForm && userMessage === "New passwords do not match!"}
                                                    label="Confirm password"
                                                    autoComplete="password"
                                                    type="password"
                                                    name="confirmPassword"
                                                    variant="outlined"
                                                    value={confirmedPassword}
                                                    onChange={(e) => handleConfirmedPasswordChange(e)}
                                                    helperText={invalidForm && userMessage === "New passwords do not match!" ? userMessage : ""}
                                                    fullWidth
                                                />
                                            </Typography>
                                        </CardContent>
                                        <Button variant="contained" color="primary" id="editProfile" name="saveChangesButton"
                                                className={classes.enabledButton} onClick={onSaveChangesClicked}>
                                            Save changes
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Container>
                        </Container>
                    </Container>
                </div>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ redirect: redirect, logIn: logIn }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(EditProfileComponent);
