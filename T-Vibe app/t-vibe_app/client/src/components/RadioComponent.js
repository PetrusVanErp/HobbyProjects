import React, {useEffect, useState} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {redirect} from "../actions";
import {getEmbeddedTrackUri} from "./connections/SpotifyHandler";
import {getSoundCloudTrackUri} from "./connections/SoundCloudHandler";
import {getTracksByChosenGenre, updateUserStats} from "./helpers/RadioComponentHelper"
import {getTrackByUrl} from "./helpers/CreatePlaylistComponentHelper";

import '../css/Playlist.css';

import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    radioContainer: {
        paddingBottom: '30px'
    },
    cardContent: {
        maxHeight: '385px',
        overflow: 'auto'
    },
    card: {
        height: '100%',
        width: '350%',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing(2)
    },
    submitButton: {
        marginTop: theme.spacing(2)
    },
    songInput: {
        width: '100%'
    },
    radioHeader: {
        marginLeft: theme.spacing(2)
    },
    nonStop: {
        marginTop: theme.spacing(1)
    },
    labelHeader: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    table: {
        marginLeft: theme.spacing(5)
    }
}))


function RadioComponent(props) {
    
    const classes = useStyles()

    const [embeddedUri, setEmbeddedUri] = useState(null)
    const [radioGenre, setRadioGenre] = useState('')
    const [radioPlaylistCount, setRadioPlaylistCount] = useState(0)
    const [genres, setGenres] = useState([])

    const [songUrl, setSongUrl] = useState('')
    const [selectedTrack, setSelectedTrack] = useState(null)

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }

    const xs = 12
    const sm = 6
    const md = 4

    useEffect(() => {
        fetch(`http://localhost:3001/tracks/genres`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
        }).then(response => response.json().then(json => setGenres(json)))
    }, [])

    async function onSubmit() {
        const selectedTrack = await getTrackByUrl(songUrl)
        if(selectedTrack) {
            setSelectedTrack(selectedTrack)
        } else {
            alert('No song found!')
        }
    }

    function getSongRadio() {
        if(selectedTrack === null){
            return <div>
                <InputLabel id="demo-mutiple-name-label" className={classes.labelHeader}>Song</InputLabel>
                <TextField
                    className={classes.songInput}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Song URL"
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    input="text"
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                </TextField>
                <Button variant="contained" color="primary" className={classes.submitButton} onClick={() => {onSubmit()}}> Submit </Button>
            </div>
        }
        return <div>

            <Typography>
                Songs similar to {selectedTrack.artist + ' - ' + selectedTrack.name}
            </Typography>
            <PlayCircleFilled onClick={() => handleGenrePlayClick(selectedTrack.genres[0])} color="primary" style={{ fontSize: 80 }} />
        </div>
    }

    async function handleGenrePlayClick(genre = radioGenre) {

        let tracks = await getTracksByChosenGenre(genre)

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

            const currentTrackMessage = {
                type: "LISTENING_MESSAGE",
                username: props.activeUser.username,
                track: newTrack
            }
    
            if(props.webSocket){
                props.webSocket.send(JSON.stringify(currentTrackMessage))
            }

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

    return (
        <React.Fragment>
            <main>
                <Typography component="h4" variant="h4" align="center" color="textPrimary" className={classes.radioHeader} gutterBottom>
                    Listen to the T-Vibe radio!
                </Typography>

                <Container>
                    <Container className={classes.radioContainer}>
                        <Grid item key="Key" xs={xs} sm={sm} md={md}>
                            <Card className={classes.card}>
                                <Typography variant="h5" component="h2">
                                    Radio
                                </Typography>
                                <CardContent className={classes.cardContent}>
                                    <InputLabel id="demo-mutiple-name-label" className={classes.labelHeader}>Genre</InputLabel>
                                    <Select className={classes.songInput}
                                        labelId="demo-simple-select-label"
                                        id="radio-genre-selector"
                                        name="radio-genre-selector"
                                        value={radioGenre}
                                        onChange={(e) => setRadioGenre(e.target.value)}
                                        input={<Input />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <em>Choose genre</em>
                                            }
                                            return selected
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        {genres.map(genre => {
                                            return <MenuItem name={genre} value={genre}>{genre}</MenuItem>
                                        })}

                                    </Select>
                                    <Typography className={classes.nonStop}>
                                        Non stop {radioGenre}
                                    </Typography>
                                    <PlayCircleFilled name="playButton" onClick={() => handleGenrePlayClick()} color="primary" style={{ fontSize: 80 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Container>
                </Container>
                <Container className={classes.flexContainer}>
                    <Container className={classes.leftFlexItem}>
                        <Grid item key="Key" xs={xs} sm={sm} md={md}>
                            <Card className={classes.card}>
                                <Typography variant="h5" component="h2">
                                    Radio
                                </Typography>
                                <CardContent className={classes.cardContent}>
                                    {getSongRadio()}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Container>
                </Container>
                {embeddedUri ? <iframe title="RadioIframe" src={embeddedUri}
                    className={classes.table} width="87.5%" height="80" frameBorder="0" allowtransparency="true"
                    allow="encrypted-media">
                </iframe> : null}

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
    return bindActionCreators({ redirect: redirect }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(RadioComponent);
