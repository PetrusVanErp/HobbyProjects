import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {friends} from "../actions";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {getEmbeddedTrackUri} from "./connections/SpotifyHandler";
import {getSoundCloudTrackUri} from "./connections/SoundCloudHandler";
import {getTrackByUrl} from "./helpers/CreatePlaylistComponentHelper";
import {getTracksByChosenGenre} from "./helpers/RadioComponentHelper";
import {checkFollowing} from "./helpers/FriendsActivityComponentHelper";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        maxHeight: '385px',
        overflow: 'auto'
    },
    card: {
        height: '100%',
        width: '275%',
        marginBottom: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
    },
    cardGrid: {
        display: 'flex',
        flexDirection: 'column',
    },
    hasListenedTo: {
        marginBottom: theme.spacing(2)
    },
    isListeningTo: {
        marginBottom: theme.spacing(2)
    },
    suggestions: {
        marginBottom: theme.spacing(1)
    },
    rankItem: {
        textAlign: "left",
        textOverflow: "ellipsis",
        overflow: "hidden",
        height: "1.5em",
        lineHeight: "1.5em",
        whiteSpace: "nowrap",
        marginTop: theme.spacing(2)
    },
    noFriendsOnline : {
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        width: '18rem',
        marginLeft: theme.spacing(6),
        fontWeight: "normal"
    }
}))

function FriendsActivityComponent(props) {
    const classes = useStyles()

    const [onlineFriends, setOnlineFriends] = useState({ friends: [] })
    const [genreCount, setGenreCount] = useState(0)
    const [trackCount, setTrackCount] = useState(0)

    const xs = 12
    const sm = 6
    const md = 4

    async function setSongSuggestion(track) {

        let newTrack = {}
        let suggestedTracks = []
        let retrievedUri = ""

        switch (track.platform.toLowerCase()) {
            case 'spotify':
                const spotifyTrackUrl = `https://open.spotify.com/track/${track.url_id}`
                newTrack = await getTrackByUrl(spotifyTrackUrl)

                setGenreCount(Math.floor(Math.random() * newTrack.genres.length))
                suggestedTracks = await getTracksByChosenGenre(newTrack.genres[genreCount])

                setTrackCount(Math.floor(Math.random() * suggestedTracks.length))
                break
            case 'soundcloud':
                const soundCloudUrl = `https://soundcloud.com/${track.url_id}`
                newTrack = await getTrackByUrl(soundCloudUrl)

                setGenreCount(Math.floor(Math.random() * newTrack.genres.length))
                suggestedTracks = await getTracksByChosenGenre(newTrack.genres)

                setTrackCount(Math.floor(Math.random() * suggestedTracks.length))
                break
            default: return null
        }

        if (suggestedTracks[trackCount]) {
            if (suggestedTracks[trackCount].platform.toLowerCase() === 'soundcloud') {
                retrievedUri = await getSoundCloudTrackUri(`https://soundcloud.com/${suggestedTracks[trackCount].url_id}`)
            } else {
                retrievedUri = await getEmbeddedTrackUri(suggestedTracks[trackCount].url_id)
            }
        }
        else {
            setTrackCount(0)
        }

        return retrievedUri
    }

    async function readMessage(message) {
        if (typeof message !== "string") {
            message = JSON.stringify(message)
        }
        else {
            message = JSON.parse(message)
        }

        if (await checkFollowing(message.username, props.activeUser._id)) {

            let newState = { ...onlineFriends }

            switch (message.type) {
                case "FRIEND_ONLINE_MESSAGE":
                    const newOnlineFriendIndex = newState.friends.findIndex((element) => {
                        return element.username === message.username
                    })
                    if(newOnlineFriendIndex !== -1){
                        newState.friends.splice(newOnlineFriendIndex, 1)
                    }
                    const onlineFriend = { username: message.username, tracks: [], suggestion: "" }
                    newState.friends.push(onlineFriend)
                    setOnlineFriends({ friends: newState.friends })
                    props.friends(newState.friends)
                    break
                case "LISTENING_TRACK_MESSAGE":
                    if (onlineFriends.friends.length === 0) {
                        onlineFriends.friends = props.activeFriends
                        newState = { ...onlineFriends }
                    }
                    const currentTrack = message.track
                    const foundFriendIndex = newState.friends.findIndex((element) => {
                        return element.username === message.username
                    })

                    newState.friends[foundFriendIndex].tracks.unshift(currentTrack)
                    if (newState.friends[foundFriendIndex].tracks.length > 4) {
                        newState.friends[foundFriendIndex].tracks.pop()
                    }

                    let trackUri = await setSongSuggestion(newState.friends[foundFriendIndex].tracks[0])
                    newState.friends[foundFriendIndex].suggestion = trackUri

                    setOnlineFriends({ friends: newState.friends })
                    props.friends(newState.friends)

                    break
                case "FRIEND_OFFLINE_MESSAGE":
                    const foundIndex = newState.friends.findIndex((element) => {
                        return element.username === message.username
                    })
                    newState.friends.splice(foundIndex, 1)
                    setOnlineFriends({ friends: newState.friends })
                    props.friends(newState.friends)
                    break
                case "FOLLOWING_ONLINE_MESSAGE":
                    const newOnlineFollowingIndex = newState.friends.findIndex((element) => {
                        return element.username === message.username
                    })
                    if(newOnlineFollowingIndex !== -1){
                        newState.friends.splice(newOnlineFollowingIndex, 1)
                    }
                    const onlineFollowing = { username: message.username, tracks: [], suggestion: "" }
                    newState.friends.push(onlineFollowing)
                    setOnlineFriends({ friends: newState.friends })
                    props.friends(newState.friends)
                    break
                default:
                    return null
            }
        }
        else {
            let newState = { ...onlineFriends }
            if(message.type === "FOLLOWER_REMOVED_MESSAGE"){
                const foundFollowerIndex = newState.friends.findIndex((element) => {
                    return element.username === message.username
                })
                if(foundFollowerIndex !== -1){
                    newState.friends.splice(foundFollowerIndex, 1)
                    setOnlineFriends({ friends: newState.friends })
                    props.friends(newState.friends)
                }
            }
        }
    }

    if (props.webSocket) {
        props.webSocket.onmessage = (message) => readMessage(message.data)
    }

    function FriendsActivities() {
        return createFriendsActivities(props.activeFriends)
    }

    function createFriendsActivities(onlineFriends) {
        if (onlineFriends !== null) {
            return onlineFriends.map(friend => {
                return (
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h4" component="h2">
                                <FiberManualRecordIcon style={{ color: 'green', width: '20px', height: '20px' }} />  {friend.username}
                            </Typography>
                            <Container className={classes.isListeningTo}>
                                <Typography variant="h6">Is listening to:</Typography>
                                <Typography className={classes.rankItem} >{friend.tracks[0] !== undefined ? <ListItemIcon>
                                    {friend.tracks[0].platform.toLowerCase() === "spotify" ?
                                        <img src="Spotify_icon.png" width="25px"
                                            height="25px"
                                            alt="Spotify" />
                                        : friend.tracks[0].platform.toLowerCase() === "soundcloud" ?
                                            <img src="SoundCloud_icon.png" width="25px"
                                                height="25px" alt="SoundCloud" />
                                            : null}
                                            &nbsp;{friend.tracks[0].name} - {friend.tracks[0].artist}
                                </ListItemIcon> : null}</Typography>
                            </Container>
                            <Container className={classes.hasListenedTo}>
                                <Typography variant="h6">Has recently listened to:</Typography>
                                {friend.tracks.map(track => {
                                    return (
                                        <Typography className={classes.rankItem}>
                                            <ListItemIcon>
                                                {track.platform.toLowerCase() === "spotify" ?
                                                    <img src="Spotify_icon.png" width="25px"
                                                        height="25px"
                                                        alt="Spotify" />
                                                    : track.platform.toLowerCase() === "soundcloud" ?
                                                        <img src="SoundCloud_icon.png" width="25px"
                                                            height="25px" alt="SoundCloud" />
                                                        : null}
                                            &nbsp;{track.name} - {track.artist}
                                            </ListItemIcon>
                                        </Typography>
                                    )
                                })}
                            </Container>
                            <Container className={classes.suggestions}>
                                <Typography variant="h6">Suggestion:</Typography>
                                {friend.suggestion ? <iframe title="RadioIframe" src={friend.suggestion}
                                    className={classes.table} width="75%" height="80" frameBorder="0" allowtransparency="true"
                                    allow="encrypted-media">
                                </iframe> : null}
                            </Container>
                        </CardContent>
                    </Card>
                )
            })
        }
        else 
            return  <h3 className={classes.noFriendsOnline}>
                        None of your friends are online right now!
                    </h3>
    }

    return (
        <React.Fragment>
            <Typography component="h4" variant="h4" align="center" color="textPrimary" gutterBottom>
                Friends activity
                </Typography>

            <Grid className={classes.cardGrid} item key="Key" xs={xs} sm={sm} md={md}>
                <FriendsActivities />
            </Grid>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        webSocket: state.webSocket,
        activeUser: state.activeUser,
        activeFriends: state.friends
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ friends: friends }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(FriendsActivityComponent)