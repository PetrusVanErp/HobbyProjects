import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getPlaylists, redirect, selectPlaylist} from "../actions";
import '../css/Playlist.css';
import {getSoundCloudTrackUri} from "./connections/SoundCloudHandler";
import {getEmbeddedTrackUri} from "./connections/SpotifyHandler";
import {
    checkIfUserFollowsPlaylist,
    deletePlaylist,
    followPlaylist,
    getPlaylistCollection,
    unFollowPlaylist
} from "./helpers/PlaylistComponentHelper";

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
    spotifyButton: {
        display: 'flex',
        marginLeft: '340px',
        marginTop: '10px'
    },
    enabledButton: {
        display: 'block',
        marginLeft: '20px'
    },
    table: {
        marginTop: theme.spacing(4),
    },
    tableHead: {
        fontWeight: "bold"
    },
    innerFlexContainer: {
        padding: theme.spacing(0, 0, 0),
        display: "flex",
        flexDirection: "row",
    },
    playlistTitle: {
        marginRight: theme.spacing(16),
        marginBottom: theme.spacing(0)
    },
    playlistDescription: {
        marginTop: theme.spacing(4)
    },
    playlistItem: {
        textAlign: "left"
    },
    tracksFlexBox: {
        display: "flex",
        alignContent: "center"
    }
}))


function PlaylistComponent(props) {
    const classes = useStyles()

    const [embeddedUri, setEmbeddedUri] = useState('')
    const [owner, setOwner] = useState(null)
    const [spotifyAccountConnection, setSpotifyAccountConnection] = useState(false)
    const [ownerUserName, setOwnerUserName] = useState(null)
    const [tracksFromPlaylist, setTracksFromPlaylist] = useState(props.selectedPlaylist.tracks)

    function checkConnections() {
        const connections = props.connections
        connections.forEach(connection => {
            if (connection.platform === 'spotify') setSpotifyAccountConnection(true)
        })
    }

    function createData(_id, name, artist, platform, duration, added, url_id) {
        return { _id, name, artist, platform, duration, added, url_id }
    }

    async function getOwner(id) {
        const user = await fetch(`http://localhost:3001/users/${id}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
        }).then(response => response.json()).then(user => {
            setOwner(user.name)
            setOwnerUserName(user.username)
            return user
        })
        return user.name
    }

    getOwner(props.selectedPlaylist.owner)

    async function getUserPlaylists() {
        await getPlaylistCollection(props.activeUser._id).then((response) => {
            props.getPlaylists(response)
            props.redirect("MY_PLAYLISTS")
        })
    }

    const rows = []

    tracksFromPlaylist.forEach(track => {
        rows.push(createData(track._id, track.name, track.artist, track.platform, track.duration, track.added_on.substring(0, 10), track.url_id))
    })

    function msToTime(s) {
        // Pad to 2 or 3 digits, default is 2
        function pad(n, z) {
            z = z || 2
            return ('00' + n).slice(-z)
        }

        let ms = s % 1000
        s = (s - ms) / 1000
        let secs = s % 60
        s = (s - secs) / 60
        let mins = s % 60

        return pad(mins) + ':' + pad(Math.ceil(secs))
    }

    function broadcastCurrentTrack(track){

        const currentTrackMessage = {
            type: "LISTENING_MESSAGE",
            username: props.activeUser.username,
            track: track
        }

        if(props.webSocket){
            props.webSocket.send(JSON.stringify(currentTrackMessage))
        }
    }

    async function handleTrackClick(row) {
        if (row.platform.toLowerCase() === "spotify") {
            setEmbeddedUri(await getEmbeddedTrackUri(row.url_id))
            checkConnections()
            broadcastCurrentTrack(row)
        } else if (row.platform.toLowerCase() === "soundcloud") {
            const soundCloudUrl = "https://soundcloud.com/" + row.url_id
            setEmbeddedUri(await getSoundCloudTrackUri(soundCloudUrl))
            broadcastCurrentTrack(row)
        }

        await fetch(`http://localhost:3001/users/${props.activeUser._id}/stats`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                track_id: row._id
            }),
        })
    }

    async function handleUnFollowClick(playlist) {
        await unFollowPlaylist(props.activeUser.username, playlist).then(async () => {
            await getUserPlaylists()
        })
    }

    async function handleFollowClick(playlist) {
        await followPlaylist(props.activeUser.username, playlist).then(async () => {
            await getUserPlaylists()
        })
    }

    async function handleDeletePlaylistClick(playlist) {
        await deletePlaylist(playlist).then(async () => {
            await getUserPlaylists()
        })
    }

    function FollowButton(props) {

        const [following, setFollowing] = useState(null)
        const [error, setError] = useState(null)

        async function getFollowing() {
            try {

                const followed = await checkIfUserFollowsPlaylist(props.activeUser._id, props.playlist._id)
                if (followed) {
                    setFollowing(<Button variant="contained" color="secondary" id="unFollowPlaylist"
                        className={classes.enabledButton} onClick={() => handleUnFollowClick(props.playlist)}>
                        Unfollow
                    </Button>)
                }
                else {
                    setFollowing(<Button variant="contained" color="primary" id="followPlaylist"
                        className={classes.enabledButton} onClick={() => handleFollowClick(props.playlist)}>
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

    function EditButton(props) {
        return <Button variant="contained" color="primary" id="editPlaylist"
            className={classes.enabledButton} onClick={() => props.redirect("EDIT_PLAYLIST")}>
            Edit playlist
                </Button>

    }

    function DeleteButton(props) {
        return <Button variant="contained" color="default" id="deletePlaylist"
            className={classes.enabledButton} onClick={() => handleDeletePlaylistClick(props.playlist)}>
            Delete
            </Button>
    }

    async function handleOrderUpwardClick(e, row) {
        e.stopPropagation()
        await reorderTracklist(row, "up")
    }

    async function handleOrderDownwardClick(e, row) {
        e.stopPropagation()
        await reorderTracklist(row, "down")
    }

    async function reorderTracklist(row, direction) {
        const foundIndex = tracksFromPlaylist.findIndex(function (element, index) {
            return element._id == row._id
        })

        let tempTracks = tracksFromPlaylist

        let changedTrack

        if (direction === "down") {
            changedTrack = tempTracks[foundIndex + 1]
            tempTracks[foundIndex + 1] = tempTracks[foundIndex]
            tempTracks[foundIndex] = changedTrack
        }
        else if (direction === "up") {
            changedTrack = tempTracks[foundIndex]
            tempTracks[foundIndex] = tempTracks[(foundIndex - 1)]
            tempTracks[(foundIndex - 1)] = changedTrack
        }

        let idsOfTracks = []
        tempTracks.map((track, index) => {
            idsOfTracks[index] = track._id
        })

        let updatedPlaylist = {
            name: props.selectedPlaylist.name,
            description: props.selectedPlaylist.description,
            owner: props.selectedPlaylist.owner,
            image_url: props.selectedPlaylist.image_url,
            tracks: idsOfTracks
        }

        await fetch(`http://localhost:3001/playlists/${props.selectedPlaylist._id}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playlist: updatedPlaylist
            }),
        }).then((response) => {
            if (response.status === 200) {
                setTracksFromPlaylist(tempTracks)
                updatedPlaylist.tracks = tempTracks
                updatedPlaylist._id = props.selectedPlaylist._id
                props.selectPlaylist(updatedPlaylist)
            }
        })
    }

    return (
        <React.Fragment>
            <main>
                <div className={classes.heroContent}>
                    <Container>

                    </Container>
                </div>
                <Container className={classes.flexContainer}>
                    <Container className={classes.leftFlexItem}>
                        <Typography>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                />
                            </Card>
                        </Typography>

                    </Container>
                    <Container className={classes.rightFlexItem}>
                        <Container className={classes.innerFlexContainer}>
                            <Typography className={classes.playlistTitle} gutterBottom variant="h4" component="h2" name="playlistTitle">
                                {props.selectedPlaylist.name}
                            </Typography>
                            {ownerUserName === props.activeUser.username ? <EditButton redirect={props.redirect} /> : <FollowButton playlist={props.selectedPlaylist} activeUser={props.activeUser} />}
                            {ownerUserName === props.activeUser.username ? <DeleteButton playlist={props.selectedPlaylist} /> : ""}
                        </Container>

                        <Typography className={classes.playlistItem}>
                            created by <b>{owner}</b>
                        </Typography>
                        <Card className={classes.playlistDescription}>
                            <CardContent className={classes.cardContent}>
                                <Typography className={classes.playlistItem}>
                                    {props.selectedPlaylist.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Container>

                </Container>
                <Container className={classes.tracksFlexBox}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} id="tfhover" size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead}>Track</TableCell>
                                    <TableCell className={classes.tableHead} align="right">Artist</TableCell>
                                    <TableCell className={classes.tableHead} align="right">Platform</TableCell>
                                    <TableCell className={classes.tableHead} align="right">Duration</TableCell>
                                    <TableCell className={classes.tableHead} align="right">Added</TableCell>
                                    {ownerUserName === props.activeUser.username ?
                                        <TableCell className={classes.tableHead} align="right">Order</TableCell> : ""}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={row.name} onClick={async () => await handleTrackClick(row)}>
                                        <TableCell>
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.artist}</TableCell>
                                        <TableCell align="right">{<ListItemIcon>
                                            {row.platform.toLowerCase() === "spotify" ?
                                                <img alt="Spotify icon" src="Spotify_icon.png" width="20px"
                                                     height="20px"/>
                                                : row.platform.toLowerCase() === "soundcloud" ?
                                                    <img alt="SoundCloud icon" src="SoundCloud_icon.png" width="20px"
                                                         height="20px"/>
                                                    : null}
                                        </ListItemIcon>}</TableCell>
                                        <TableCell align="right">{msToTime(row.duration)}</TableCell>
                                        <TableCell align="right">{row.added}</TableCell>
                                        {ownerUserName === props.activeUser.username ?
                                            <TableCell align="right">
                                                {index > 0 ? <ArrowUpward onClick={(e) => handleOrderUpwardClick(e, row)} /> : null}
                                                {index !== (rows.length - 1) ? <ArrowDownward onClick={(e) => handleOrderDownwardClick(e, row)} /> : null}
                                            </TableCell> : ""}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
                <div>
                    <iframe title="PlaylistIframe" src={embeddedUri}
                            className={classes.table} width="75%" height="80" frameBorder="0" allowtransparency="true"
                            allow="encrypted-media">
                    </iframe>
                    {embeddedUri.includes("spotify.com/embed") && !spotifyAccountConnection ?
                        <Button variant="contained" color="primary" id="redirectSettings"
                                className={classes.spotifyButton} onClick={() => props.redirect("SETTINGS")}>
                            Connect your Spotify
                        </Button> : null}
                </div>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
        connections: state.activeUser.connections,
        selectedPlaylist: state.selectedPlaylist,
        webSocket: state.webSocket
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ redirect: redirect, getPlaylists: getPlaylists, selectPlaylist: selectPlaylist }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(PlaylistComponent);
