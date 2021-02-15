import React, {useEffect, useState} from "react";

import {redirect, selectPlaylist} from "../actions";
import {initializeSpotify} from './connections/SpotifyHandler';
import {
    getTrackByUrl,
    removeTrackFromUserPlaylist,
    saveTracksInPlaylist,
    saveUserPlaylist,
    updateTracksInUserPlaylist
} from "./helpers/CreatePlaylistComponentHelper";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 3),
        margin: theme.spacing(0, 0, 3)
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },

    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftFlexItem: {
        order: 1,
        paddingBottom: '30px'
    },
    rightFlexItem: {
        order: 2
    },
    cardContent: {
        maxHeight: '385px',
        overflow: 'auto'
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },

    enabledButton: {
        display: 'block'
    },

    newTrackForm: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: theme.spacing(2)
    },
    newTrackUrl: {
        marginRight: theme.spacing(2)
    }
}))

function CreatePlaylistComponent(props) {

    const classes = useStyles()

    const [trackUrl, setTrackUrl] = useState("")
    const [playlistId, setPlaylistId] = useState("")
    const [playlistName, setPlaylistName] = useState("")
    const [playlistDescription, setPlaylistDescription] = useState("")
    const [token, setToken] = useState('')
    const [tracks, setTracks] = useState({ tracks: [] })
    const [invalidForm, setInvalidForm] = useState(false)
    const [userMessage, setUserMessage] = useState("")

    useEffect(() => {
        if (props.selectedPlaylist !== null) {
            setPlaylistId(props.selectedPlaylist._id)
            setPlaylistName(props.selectedPlaylist.name)
            setPlaylistDescription(props.selectedPlaylist.description)
            setTracks({ tracks: props.selectedPlaylist.tracks })
        }
        async function initializeConnection() {
            let token = await initializeSpotify()
            setToken(token)
        }
        initializeConnection()
    }, [])

    async function saveTracks(tracks) {
        return await saveTracksInPlaylist(tracks)
    }

    async function savePlaylist(playlist) {
        return await saveUserPlaylist(playlist)
    }

    async function updateTracksInPlaylist(playlistID, playlist) {
        return await updateTracksInUserPlaylist(playlistID, playlist)
    }

    async function removeTrackFromPlaylist(playlistID, track) {
        return await removeTrackFromUserPlaylist(playlistID, track)
    }

    function handleTrackUrlChange(e) {
        setTrackUrl(e.target.value)
    }
    function handlePlaylistNameChange(e) {
        setPlaylistName(e.target.value)
    }
    function handlePlaylistDescriptionChange(e) {
        setPlaylistDescription(e.target.value)
    }

    async function handleOnAddTrackClick (e){
        e.preventDefault()
        const track = await getTrackByUrl(trackUrl, token)
        const newState = { ...tracks }
        newState.tracks.push(track)
        setTracks({ tracks: newState.tracks })
    }

    async function onSavePlaylistClicked(e) {
        e.preventDefault()

        if (playlistName === "") {
            setInvalidForm(true)
            setUserMessage("You must enter a name for this playlist!")
        }
        else {
            const trackList = await saveTracks(tracks.tracks)
            let ids = []
            for (let i = 0; i < trackList.length; i++) {
                ids.push(trackList[i]._id)
            }

            let playlistToSendToDb = {
                name: playlistName,
                description: playlistDescription,
                owner: props.activeUser._id,
                image_url: "to be determined",
                tracks: ids
            }

            let playlistToSendToState = playlistToSendToDb
            playlistToSendToState.tracks = trackList

            let dbPlaylist = null

            if (props.selectedPlaylist !== null) {
                await updateTracksInPlaylist(playlistId, playlistToSendToDb)
            } else {
                dbPlaylist = await savePlaylist(playlistToSendToDb)
            }

            if (dbPlaylist) {
                playlistToSendToState._id = dbPlaylist._id
            }
            else{
                playlistToSendToState._id = playlistId
            }

            props.selectPlaylist(playlistToSendToState)
            props.redirect("VIEW_PLAYLIST")
        }
    }

    async function onRemoveTrackClick(track) {
        if (props.selectedPlaylist !== null) {
            await removeTrackFromPlaylist(playlistId, track)
        }
        const newState = { ...tracks }

        const index = newState.tracks.indexOf(track)
        if (index > -1) {
            newState.tracks.splice(index, 1)
        }

        setTracks({ tracks: newState.tracks })
    }

    return (
        <React.Fragment>
            <main>
                <div className={classes.heroContent}>
                    <Container >
                        <Typography component="h4" variant="h4" align="center" color="textPrimary" name="playlist" gutterBottom>
                            {props.selectedPlaylist ? props.selectedPlaylist.name : "New Playlist"}
                        </Typography>
                    </Container>
                </div>
                <Container className={classes.flexContainer}>
                    <Container className={classes.leftFlexItem}>
                        <Typography>
                            <FormControl className={classes.newTrackForm}>
                                <TextField
                                    autoComplete="fname"
                                    name="TrackUrl"
                                    variant="outlined"
                                    fullWidth
                                    label="Enter the url to your track here"
                                    autoFocus
                                    onChange={(e) => handleTrackUrlChange(e)}
                                    className={classes.newTrackUrl}
                                />
                                <Button variant="contained" color="primary" name="addTrack" onClick={(e) => handleOnAddTrackClick(e, trackUrl)}>
                                    Add to playlist
                                </Button>
                            </FormControl>
                            <Card className={classes.card}>
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Tracks in the playlist
                                        </Typography>
                                    <List component="nav" aria-label="main mailbox folders">
                                        {
                                            !tracks ? null :
                                                tracks.tracks.map(track => {

                                                    let genres = null

                                                    if (typeof track.genres === "object") {
                                                        if (track.genres.length > 1) {
                                                            const amountOfGenres = track.genres.length - 1
                                                            genres = track.genres.map((genre, index) => {
                                                                if (index === amountOfGenres) return genre
                                                                return genre + ', '
                                                            })
                                                        }
                                                        else {
                                                            genres = track.genres
                                                        }
                                                    }
                                                    else {
                                                        genres = track.genres.toLowerCase()
                                                    }
                                                    return (
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                {track.platform.toLowerCase() === "spotify" ?
                                                                    <img src="Spotify_icon.png" width="35px"
                                                                         height="35px"
                                                                         alt="Spotify"/>
                                                                    : track.platform.toLowerCase() === "soundcloud" ?
                                                                        <img src="SoundCloud_icon.png" width="35px"
                                                                             height="35px" alt="SoundCloud"/>
                                                                        : null}
                                                            </ListItemIcon>
                                                            <ListItemText primary={track.name}
                                                                secondary={track.artist} />
                                                            <ListItemText primary={genres} />
                                                            <Button className={classes.enabledButton}
                                                                onClick={() => onRemoveTrackClick(track)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </ListItem>
                                                    )
                                                })
                                        }
                                    </List>
                                </CardContent>
                            </Card>
                        </Typography>

                    </Container>
                    <Container className={classes.rightFlexItem}>
                        <Typography>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <TextField
                                            error={invalidForm}
                                            autoComplete="playlistName"
                                            name="playlistName"
                                            label="Enter the name of the playlist"
                                            variant="outlined"
                                            value={playlistName}
                                            onChange={(e) => handlePlaylistNameChange(e)}
                                            helperText={invalidForm ? userMessage : ""}
                                            fullWidth
                                        />
                                    </Typography>
                                    <Typography>
                                        <TextField
                                            autoComplete="playlistDescription"
                                            name="playlistDescription"
                                            label="Enter the description of the playlist"
                                            variant="outlined"
                                            value={playlistDescription}
                                            onChange={(e) => handlePlaylistDescriptionChange(e)}
                                            fullWidth
                                        />

                                    </Typography>
                                </CardContent>
                            </Card>
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" id="saveChanges"
                                        className={classes.enabledButton} onClick={onSavePlaylistClicked}>
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </Container>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        selectedPlaylist: state.selectedPlaylist,
        activeUser: state.activeUser
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ selectPlaylist: selectPlaylist, redirect: redirect }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(CreatePlaylistComponent);
