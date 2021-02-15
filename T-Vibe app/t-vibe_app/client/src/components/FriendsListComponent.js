import React, { useEffect, useState } from "react";

import { unFollowUser } from "../components/helpers/SearchComponentHelper";
import { getFollowingUsers } from '../components/helpers/FollowUserHelper';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { redirect, friend } from "../actions";

import { Avatar, Button } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 3),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    userAvatar: {
        height: '150px',
        width: '150px'
    },
    flexCardRowUser: {
        display: "flex",
        flexDirection: "row",
    },
    flexCardColumn: {
        display: "flex",
        flexDirection: "column",
    },
    viewProfileButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}))

function FriendslistComponent(props) {
    const classes = useStyles()

    const friendsItemsSpacing = 4
    const xs = 12
    const sm = 6

    const activeUser = props.activeUser

    const [followingUsers, setFollowingUsers] = useState([])
    
    useEffect(() => {
        getFollowing()
    }, [])

    async function getFollowing() {
        const following = await getFollowingUsers(activeUser)
        setFollowingUsers(following)
    }

    async function onViewProfileClicked(user) {
        props.friend(user)
        props.redirect("PROFILE")
    }

    function createListItems() {
        if (followingUsers) {
            return followingUsers.map(user => {
                return (
                    <Grid item xs={xs} sm={sm} md={6}>
                        <Container className={classes.flexCardRowUser}>
                            <Avatar className={classes.userAvatar} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            <Container className={classes.flexCardColumn}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {user.username}
                                </Typography>
                                <Typography>
                                    {user.name}
                                </Typography>
                                <Button className={classes.viewProfileButton} variant="contained" size="small" color="primary"
                                    onClick={() => onViewProfileClicked(user)}>
                                    View Profile
                                </Button>
                            </Container>
                        </Container>
                    </Grid>
                )
            })
        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h4" variant="h4" align="center" color="textPrimary" name="playlistOverview" gutterBottom>
                            Friends overview
                        </Typography>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={friendsItemsSpacing}>
                        {createListItems()}
                    </Grid>
                </Container>
            </main>
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
    return bindActionCreators({ redirect: redirect, friend: friend }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(FriendslistComponent);