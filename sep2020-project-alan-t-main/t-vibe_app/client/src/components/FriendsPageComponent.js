import React, {useEffect, useState} from "react";

import {
    checkIfUserAlreadyFollowsOtherUser,
    followUser,
    getClickedPlaylist,
    getClickedUser,
    getFavoriteTrackFromUser,
    getUser,
    unFollowUser
} from "./helpers/FriendsPageComponentHelper"
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {friend, logIn, redirect, selectPlaylist} from "../actions";

import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {Button} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 2),
    },
    enabledButton: {
        display: 'block',
        marginLeft: '150px',
        marginTop: '15px',
        maxWidth: '200px',
        maxHeight: '40px'
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
    playlistsFlexBox: {
        margin: theme.spacing(1)
    },
    innerFlexContainer: {
        padding: theme.spacing(0, 0, 0),
        display: "flex",
        flexDirection: "row",
    },
    profileItem: {
        textAlign: "left"
    },
    playlistButton: {
        float: "left",
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    favoriteTrack: {
        textAlign: "center",
        marginTop: theme.spacing(1)
    },
    tableHead: {
        fontWeight: "bold"
    },
    userButton: {
        float: "left",
        marginLeft: theme.spacing(4),
        marginBottom: theme.spacing(1)
    },
    viewString: {
        color: "blue"
    }
}))

function FriendPageComponent(props) {
    const classes = useStyles()

    const fullName = props.myFriend.name.split(" ")
    const firstName = fullName[0]
    const lastName = fullName[1]
    const username = props.activeUser.username

    const [favoriteTrack, setFavoriteTrack] = useState("-")
    const [favoritePlaylists, setFavoritePlaylists] = useState([])
    const [followedUsers, setFollowedUsers] = useState({ users: [] })
    const [friendsButtonClicked, setFriendsButtonClicked] = useState(false)
    const [playlistButtonClicked, setPlaylistButtonClicked] = useState(false)

    if (!friendsButtonClicked && !playlistButtonClicked) {
         onFriendsClick(props.myFriend._id)
    }

    async function getFavoriteTrack() {
        if(props.myFriend.favorite_track !== null){
            const foundFavoriteTrack = await getFavoriteTrackFromUser(props.myFriend.favorite_track)
            setFavoriteTrack(foundFavoriteTrack)
            return foundFavoriteTrack
        }
    }

    getFavoriteTrack()

    async function onPlaylistsClick(playlists) {
        const favoritePlaylist = await getClickedPlaylist(playlists)
        setFavoritePlaylists(favoritePlaylist)
        setPlaylistButtonClicked(true)
        setFriendsButtonClicked(false)
    }

    async function onFriendsClick(userID) {
        const followedUser = await getClickedUser(userID)
        setFollowedUsers(followedUser)
        setFriendsButtonClicked(true)
        setPlaylistButtonClicked(false)
    }

    async function checkIfUserAlreadyFollowsUser(userId, followedUserId) {
        return await checkIfUserAlreadyFollowsOtherUser(userId, followedUserId)
    }


    async function handleOnFollowClick(user) {
        const updatedUser = await followUser(username, user)
        const newFollowerMessage = {
            type: "ADDED_FOLLOWER_MESSAGE",
            username: user.username
        }
        props.logIn(updatedUser)
        props.webSocket.send(JSON.stringify(newFollowerMessage))
        props.redirect("MY_FRIENDS")
    }
    async function handleOnUnFollowClick(user) {
        await unFollowUser(username, user)
        const updatedUser = await getUser(props.activeUser._id)
        const followingMessage = {
            type: "REMOVED_FOLLOWER_MESSAGE",
            username: user.username
        }
        props.logIn(updatedUser)
        props.webSocket.send(JSON.stringify(followingMessage))
        props.redirect("MY_FRIENDS")
    }

    function FollowUserButton(props) {

        const [following, setFollowing] = useState(null)
        const [error, setError] = useState(null)

        async function getFollowing() {
            try {
                const followed = await checkIfUserAlreadyFollowsUser(props.activeUser._id, props.myFriend._id)
                if (followed) {
                    setFollowing(<Button name="unfollowButton" variant="contained" color="secondary" id="unFollowUser"
                        className={classes.enabledButton} onClick={() => handleOnUnFollowClick(props.myFriend)}>
                        Unfollow
                    </Button>)
                }
                else {
                    setFollowing(<Button name="followButton" variant="contained" color="primary" id="followUser"
                        className={classes.enabledButton} onClick={() => handleOnFollowClick(props.myFriend)}>
                        Follow
                    </Button>)
                }
            }
            catch (err) {
                setError(err)
            }
        }
        useEffect(() => {
            getFollowing()
        }, [])

        if (error) return "Failed to load button"
        return following
    }


    function handlePlaylistClick(playlist) {
        props.selectPlaylist(playlist)
        props.redirect("VIEW_PLAYLIST")
    }


    async function onProfileClick(user) {
        setFavoritePlaylists([])

        setFriendsButtonClicked(false)
        setPlaylistButtonClicked(false)
        setFavoriteTrack("-")

        if (user.username === props.activeUser.username) {
            props.redirect("MY_PROFILE")
        }
        else {
            props.friend(user)
            props.redirect("PROFILE")
        }
    }


    function createFriendsTable() {
        return <Container className={classes.playlistsFlexBox}>
            <TableContainer component={Paper}>
                <Table className={classes.table} id="tfhover" size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead}>Username</TableCell>
                            <TableCell className={classes.tableHead}>View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {followedUsers.map((row, index) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.username}</TableCell>
                                <TableCell className={classes.viewString} onClick={() => onProfileClick(row)}>
                                    View
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    }

    function createFollowingPlaylistsTable() {

        return <Container className={classes.playlistsFlexBox}>
            <TableContainer component={Paper}>
                <Table className={classes.table} id="tfhover" size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead}>Playlist name</TableCell>
                            <TableCell className={classes.tableHead}>Owner</TableCell>
                            <TableCell className={classes.tableHead}>View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {favoritePlaylists.map((row, index) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.ownerName}</TableCell>
                                <TableCell className={classes.viewString} onClick={() => handlePlaylistClick(row)}>
                                    View
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
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
                                        <Container className={classes.innerFlexContainer}>
                                            <Typography className={classes.profileItem} variant="h2" name="yourProfile" color="textPrimary">
                                                {props.myFriend.username}
                                            </Typography>
                                            <FollowUserButton
                                                myFriend={props.myFriend}
                                                redirect={props.redirect}
                                                activeUser={props.activeUser}
                                            />
                                        </Container>
                                        <CardContent className={classes.cardContent}>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                First name
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {firstName}
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Last name
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {lastName}
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Favorite genres
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {props.myFriend.preferred_genres != ""
                                                    ? props.myFriend.preferred_genres.join(", ")
                                                    : "-"}
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Favorite track
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {favoriteTrack}
                                            </Typography>
                                        </CardContent>
                                    </CardContent>
                                </Card>
                            </Container>
                        </Container>
                        <br></br>
                        <Container>
                            <Card className={classes.card} variant="outlined">
                                <Typography className={classes.favoriteTrack} variant="h3" color="textPrimary">
                                    Following
                            </Typography>
                                <Button name="userButton" variant="outlined" className={classes.userButton} onClick={() => { onFriendsClick(props.myFriend._id) }} disabled={friendsButtonClicked}>Friends</Button>
                                <Button name="playlistButton" variant="outlined" className={classes.playlistButton} onClick={() => { onPlaylistsClick(props.myFriend.subscribed_playlists) }} disabled={playlistButtonClicked}>Playlists</Button>
                                {playlistButtonClicked ? createFollowingPlaylistsTable() : ""}
                                {friendsButtonClicked ? createFriendsTable() : ""}
                            </Card>
                        </Container>
                    </Container>
                </div>
            </main >
        </React.Fragment >
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
        myFriend: state.friend,
        webSocket: state.webSocket
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ redirect: redirect, selectPlaylist: selectPlaylist, friend: friend, logIn: logIn }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(FriendPageComponent);
