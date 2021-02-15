import React, {useEffect, useState} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {redirect} from "../actions";
import {getSoundCloudTrackUri} from "./connections/SoundCloudHandler";
import {getEmbeddedTrackUri} from "./connections/SpotifyHandler";
import {getTrendings} from "./helpers/TrendingComponentHelper";
import {getTracksByArtist, getTracksByChosenGenre, updateUserStats} from "./helpers/RadioComponentHelper";

import '../css/Playlist.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    spotifyButton: {
        display: 'flex',
        marginLeft: '340px',
        marginTop: '10px'
    },
    table: {
        marginTop: theme.spacing(4),
    },
    tableHead: {
        fontWeight: "bold"
    },
    tracksFlexBox: {
        display: "flex",
        alignContent: "center"
    },
    scrollable: {
        maxHeight: "500px",
        overflowY: "scroll"
    }
}))

function TrendingComponent(props) {
    const classes = useStyles()

    const [embeddedUri, setEmbeddedUri] = useState('')
    const [spotifyAccountConnection, setSpotifyAccountConnection] = useState(false)
    const [trendingTracks, setTrendingTracks] = useState([])
    const [trendingArtists, setTrendingArtists] = useState([])
    const [trendingGenres, setTrendingGenres] = useState([])
    const [radioPlaylistCount, setRadioPlaylistCount] = useState(0)

    const trackRows = []
    const artistRows = []
    const genreRows = []

    useEffect(async () => {
        const trendingObject = await getTrendings()
        setTrendingTracks(trendingObject.tracks)
        setTrendingArtists(trendingObject.artists)
        setTrendingGenres(trendingObject.genres)
    }, [])


    function checkConnections() {
        const connections = props.connections
        connections.forEach(connection => {
            if (connection.platform === 'spotify') setSpotifyAccountConnection(true)
        })
    }

    function createTrackData(_id, name, artist, platform, duration, added, url_id, count) {
        return {_id, name, artist, platform, duration, added, url_id, count}
    }

    trendingTracks.forEach(track => {
        trackRows.push(createTrackData(track._id, track.name, track.artist, track.platform, track.duration, track.added_on.substring(0, 10), track.url_id, track.count))
    })

    trendingArtists.forEach(artist => {
        artistRows.push({artist: artist.artist, count: artist.count})
    })

    trendingGenres.forEach(genre => {
        genreRows.push({genre: genre.genre, count: genre.count})
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

    function broadcastCurrentTrack(track) {

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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                track_id: row._id
            }),
        })
    }

    async function handleRadioPlayClick(getTracks) {
        let tracks = await getTracks

        for (let i = 0; i < tracks.length; i++) {
            const j = Math.floor(Math.random() * i)
            const temp = tracks[i]
            tracks[i] = tracks[j]
            tracks[j] = temp
        }

        let newTrack = tracks[radioPlaylistCount]

        if (newTrack) {
            setRadioPlaylistCount(radioPlaylistCount + 1)
            const amountOfTracks = tracks.length - 1

            if (radioPlaylistCount === amountOfTracks) setRadioPlaylistCount(0)

            await updateUserStats(props.activeUser._id, newTrack._id)

            broadcastCurrentTrack(newTrack)

            switch (newTrack.platform.toLowerCase()) {
                case 'spotify':
                    return setEmbeddedUri(await getEmbeddedTrackUri(newTrack.url_id))
                case 'soundcloud':
                    const soundCloudUrl = "https://soundcloud.com/" + newTrack.url_id
                    return setEmbeddedUri(await getSoundCloudTrackUri(soundCloudUrl))
                default: return null
            }
        }
        else {
            setRadioPlaylistCount(0)
        }
    }

    function TrendingList() {
        return (
            <div>
                {trendingTracksTable(trackRows)}
                <br/>
                {trendingArtistsTable(artistRows)}
                <br/>
                {trendingGenresTable(genreRows)}
            </div>
        )
    }

    function trendingGenresTable(rows) {
        return (
            <div>
                <Typography variant="h4" color="primary">
                    Genres
                </Typography>
                <Container className={classes.tracksFlexBox}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} id="tfhover" size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="left">Rank</TableCell>
                                    <TableCell className={classes.tableHead} align="left">Genre</TableCell>
                                    <TableCell className={classes.tableHead} align="right">No. of times
                                        listened</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(0, 10).map((row, index) => (
                                    <TableRow key={row.name} onClick={() => handleRadioPlayClick(getTracksByChosenGenre(row.genre))}>
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell align="left">{row.genre}</TableCell>
                                        <TableCell align="right">{row.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </div>
        )
    }

    function trendingArtistsTable(rows) {
        return (
            <div>
                <Typography variant="h4" color="primary">
                    Artists
                </Typography>
                <Container className={classes.tracksFlexBox}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} id="tfhover" size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="left">Rank</TableCell>
                                    <TableCell className={classes.tableHead} align="left">Artist</TableCell>
                                    <TableCell className={classes.tableHead} align="right">No. of times
                                        listened</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(0, 10).map((row, index) => (
                                    <TableRow key={row.name} onClick={() => handleRadioPlayClick(getTracksByArtist(row.artist))}>
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell align="left">{row.artist}</TableCell>
                                        <TableCell align="right">{row.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </div>
        )
    }

    function trendingTracksTable(rows) {
        return (
            <div>
                <Typography variant="h4" color="primary">
                    Tracks
                </Typography>
                <Container className={classes.tracksFlexBox}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} id="tfhover" size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableHead} align="left">Rank</TableCell>
                                    <TableCell className={classes.tableHead}>Track</TableCell>
                                    <TableCell className={classes.tableHead} align="left">Artist</TableCell>
                                    <TableCell className={classes.tableHead} align="right">Duration</TableCell>
                                    <TableCell className={classes.tableHead} align="right">No. of times
                                        listened</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(0, 10).map((row, index) => (
                                    <TableRow key={row.name} onClick={async () => await handleTrackClick(row)}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell align="left">{row.artist}</TableCell>
                                        <TableCell align="right">{msToTime(row.duration)}</TableCell>
                                        <TableCell align="right">{row.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </div>
        )

    }
    return (
        <React.Fragment>
            <main>
                <br/>
                <div className={classes.scrollable}>
                <TrendingList/>
                </div>
                
                {embeddedUri.includes("spotify.com/embed") && !spotifyAccountConnection ?
                    <Button variant="contained" color="primary" id="redirectSettings"
                            className={classes.spotifyButton} onClick={() => props.redirect("SETTINGS")}>
                        Connect your Spotify
                    </Button> : null}
                <iframe title="PlaylistIframe" src={embeddedUri}
                        className={classes.table} width="75%" height="80" frameBorder="0" allowtransparency="true"
                        allow="encrypted-media">
                </iframe>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
        connections: state.activeUser.connections,
        webSocket: state.webSocket
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        redirect: redirect
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(TrendingComponent);
