import React from "react";

import {bindActionCreators} from "redux";
import {getPlaylists, logOut, redirect, friends} from "../actions";
import {connect} from "react-redux";
import {
    getAllPlaylistsFromUserById,
    getDefaultPlaylistsByUserId,
    logoutClicked
} from "../components/helpers/HeaderComponentHelper"

import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: "#001237"
    },
    toolbarItem: {
        marginRight: theme.spacing(2)
    },
    itemColor: {
        color: "#1976D2"
    },
    title: {
        marginRight: theme.spacing(4)
    },
    logoutButton: {
        marginLeft: theme.spacing(80)
    }
}))

function HeaderComponent(props) {
    const classes = useStyles()

    async function getAllPlaylistsFromUser(userId) {
        return await getAllPlaylistsFromUserById(userId)
    }

    async function getPlaylistsFromUser() {
        await getAllPlaylistsFromUser(props.activeUser._id).then((response) => {
            props.getPlaylists(response)
            props.redirect("MY_PLAYLISTS")
        })
    }

    async function getDefaultPlaylists(userId) {
        return await getDefaultPlaylistsByUserId(userId)
    }

    async function getDefaultPlaylistsForUser() {
        await getDefaultPlaylists(props.activeUser._id).then((response) => {
            props.getPlaylists(response)
            props.redirect("SEARCH")
        })
    }

    async function handleLogoutClicked() {
        await logoutClicked()
        const logoutMessage = {
            type: "LOGOUT_MESSAGE",
            username: props.activeUser.username
        }

        if(props.webSocket){
            props.webSocket.send(JSON.stringify(logoutMessage))
        }
        props.friends([])
        props.logOut()
        props.redirect("LOGIN")

    }

    function getToolbarItems() {
        if (props.activeUser !== null) {
            return <Grid container>
                <a href="#" onClick={() => props.redirect("HOMEPAGE")}>
                    <img src="T-Vibe.png" alt="T-Vibe logo" height="25px"/>
                </a>
                <Typography variant="h5" className={classes.title} noWrap>
                </Typography>
                <Typography variant="subtitle1" className={classes.toolbarItem} noWrap>
                    <a className={classes.itemColor} name="myProfile" href="#" onClick={() => props.redirect("MY_PROFILE")}>
                        My profile
                    </a>
                </Typography>
                <Typography variant="subtitle1" className={classes.toolbarItem} noWrap>
                    <a className={classes.itemColor} name="playlists" href="#" onClick={() => getPlaylistsFromUser()}>
                        My playlists
                    </a>
                </Typography>
                <Typography variant="subtitle1" className={classes.toolbarItem} noWrap>
                    <a className={classes.itemColor} name="friends" href="#" onClick={() => props.redirect("MY_FRIENDS")}>
                        My friends
                    </a>
                </Typography>
                <Typography variant="subtitle1" className={classes.toolbarItem} noWrap>
                    <a className={classes.itemColor} name="search" href="#" onClick={() => getDefaultPlaylistsForUser()}>
                        Find playlists or users
                    </a>
                </Typography>
                <Typography variant="subtitle1" noWrap>
                    <a className={classes.itemColor} href="#" onClick={() => props.redirect("SETTINGS")}>
                        Settings
                    </a>
                </Typography>
            </Grid>
        }
        return (
            <a href="#" onClick={() => props.redirect("HOMEPAGE")}>
                <img src="T-Vibe.png" alt="T-Vibe logo" height="25px"/>
            </a>
        )
    }

    return (
        <React.Fragment>
            <AppBar position="relative">
                <Toolbar className={classes.toolbar}>
                    {getToolbarItems()}
                    <Grid container>
                        <Typography variant="subtitle1" className={classes.logoutButton} noWrap>
                            {props.activeUser ?
                                <div> {props.activeUser.name}
                                    <br/>
                                    <a className={classes.itemColor} href="#" onClick={() => handleLogoutClicked()}>
                                        Logout&nbsp;
                                    </a>
                                </div>
                                :
                                <a className={classes.itemColor} href="#" onClick={() => props.redirect("LOGIN")}>
                                    Login&nbsp;
                                </a>
                            }
                        </Typography>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
        webSocket: state.webSocket
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({redirect: redirect, logOut: logOut, getPlaylists: getPlaylists, friends: friends}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(HeaderComponent);
