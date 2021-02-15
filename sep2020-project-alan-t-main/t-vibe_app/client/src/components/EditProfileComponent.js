import React, { useState } from "react";
import { saveChanges } from "../components/helpers/EditProfileComponentHelper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { redirect, logIn } from "../actions";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';

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
    profileItem: {
        textAlign: "left"
    },
    profileTitle: {
        textAlign: "left",
        paddingLeft: "15px"
    },
}))

function EditProfileComponent(props) {
    const classes = useStyles()
    const fullName = props.activeUser.name.split(" ")
    const [firstName, setFirstName] = useState(fullName[0])
    const [lastName, setLastName] = useState(fullName[1])
    const [email, setEmail] = useState(props.activeUser.email)

    function handleFirstNameChange(e) {
        setFirstName(e.target.value)
    }

    function handleLastNameChange(e) {
        setLastName(e.target.value)
    }

    function handleEmailChange(e) {
        setEmail(e.target.value)
    }

    async function onSaveChangesClicked(e) {
        e.preventDefault()
        const updatedUserBody = {
            name: firstName + ' ' + lastName,
            email: email
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
                                        <Typography className={classes.profileTitle} variant="h2" name="editProfile" color="textPrimary">
                                            Edit profile
                                        </Typography>
                                        <CardContent className={classes.cardContent}>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                First name
                                            </Typography>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <TextField
                                                    autoComplete="firstname"
                                                    name="firstname"
                                                    variant="outlined"
                                                    value={firstName}
                                                    onChange={(e) => handleFirstNameChange(e)}
                                                    fullWidth
                                                />
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Last name
                                                </Typography>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <TextField
                                                    autoComplete="family-name"
                                                    name="surname"
                                                    variant="outlined"
                                                    value={lastName}
                                                    onChange={(e) => handleLastNameChange(e)}
                                                    fullWidth
                                                />
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Email address
                                                </Typography>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <TextField
                                                    autoComplete="email"
                                                    name="email"
                                                    variant="outlined"
                                                    value={email}
                                                    onChange={(e) => handleEmailChange(e)}
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
