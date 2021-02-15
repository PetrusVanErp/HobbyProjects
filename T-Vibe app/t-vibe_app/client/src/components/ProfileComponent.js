import React, { useEffect, useState } from "react";


import { getUser, getFavoriteTrackFromUser } from "./helpers/FriendsPageComponentHelper";
import { favoriteTrackChange, getUserTracks } from './helpers/ProfileComponentHelper';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { redirect } from "../actions";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ButtonGroup from "@material-ui/core/ButtonGroup";

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 2),
    },
    enabledButton: {
        display: 'block'
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
    leftRankItem: {
        float: 'left',
        order: 1,
        maxWidth: '50%'
    },
    middleRankItem: {
        float: 'left',
        order: 2,
        maxWidth: '25%'
    },
    rightRankItem: {
        float: 'left',
        order: 3,
        maxWidth: '25%'
    },
    cardContent: {
        maxHeight: '600px'
    },
    cardContentRanks: {
        paddingLeft: '10%',
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
    leftCard: {
        display: 'flex'
    },
    middleCardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    profileItem: {
        textAlign: "left"
    },
    rankTitle: {
        textAlign: "center",
        marginTop: theme.spacing(1)
    },
    favoriteTrack: {
        textAlign: "center",
        marginTop: theme.spacing(1)
    },
    rankItem: {
        textAlign: "left",
        textOverflow: "ellipsis",
        overflow: "hidden",
        height: "1.2em",
        lineHeight: "1.2em",
        whiteSpace: "nowrap"
    },
    formControl: {
        minWidth: "500px",
        margin: theme.spacing(4)
    }
}))

function ProfileComponent(props) {
    const classes = useStyles()

    const fullName = props.activeUser.name.split(" ")
    const firstName = fullName[0]
    const lastName = fullName[1]

    const [tracks, setTracks] = useState([])
    const [genres, setGenres] = useState([])
    const [artists, setArtists] = useState([])
    const [userTracks, setUserTracks] = useState([])
    const [favoriteTrack, setFavoriteTrack] = useState("-")

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 500,
            },
        },
    }

    useEffect(async () => {
        fetch(`http://localhost:3001/users/${props.activeUser._id}/stats`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
        }).then(response => response.json().then(json => {
            setGenres(json.genres)
            setTracks(json.tracks)
            setArtists(json.artists)
        }))

        await getUserTracks(props.activeUser._id).then(response => setUserTracks(response))
    }, [])

    async function getFavoriteTrack() {
        const user = await getUser(props.activeUser._id)

        if (user) {
            const foundFavoriteTrack = await getFavoriteTrackFromUser(user.favorite_track)
            setFavoriteTrack(foundFavoriteTrack)
            return foundFavoriteTrack
        }
    }
    getFavoriteTrack()

    function EditButtons(props) {
        return <div>
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                <Button id="editProfile" name="editProfileButton"
                    className={classes.enabledButton} onClick={() => props.redirect("EDIT_PROFILE")}>
                    Edit profile
                </Button>
                <Button id="editPassword" name="editPasswordButton"
                    className={classes.enabledButton} onClick={() => props.redirect("EDIT_PASSWORD")}>
                    Edit password
                </Button>
            </ButtonGroup>
        </div>
    }

    async function handleFavoriteTrackChange(track) {
        await favoriteTrackChange(props.activeUser._id, track)
        setFavoriteTrack(track.name + ' - ' + track.artist + ' (' + track.platform + ')')
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
                                        <Typography className={classes.profileItem} variant="h2" name="yourProfile" color="textPrimary">
                                            Your profile
                                        </Typography>
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
                                                Email address
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {props.activeUser.email}
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Favorite genres
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {props.activeUser.preferred_genres != ""
                                                    ? props.activeUser.preferred_genres.join(", ")
                                                    : "-"}
                                            </Typography>
                                            <Typography className={classes.profileItem} variant="subtitle1" color="textSecondary">
                                                Favorite track
                                                </Typography>
                                            <Typography className={classes.profileItem} component="h6" variant="h6">
                                                {favoriteTrack}
                                            </Typography>
                                        </CardContent>
                                        <EditButtons redirect={props.redirect} />
                                    </CardContent>
                                </Card>
                            </Container>
                        </Container>
                        <br></br>
                        <Container>
                            <Card className={classes.card} variant="outlined">
                                <Typography className={classes.rankTitle} variant="h2" color="textPrimary">
                                    Your rankings
                                </Typography>
                                <CardContent className={classes.cardContentRanks}>
                                    <Container className={classes.leftRankItem}>
                                        <Typography className={classes.rankItem} component="h4" variant="h4">
                                            Tracks
                                        </Typography>
                                        {tracks.map((track, index) => {
                                            let trackRanking = index + 1
                                            return (
                                                <div>
                                                    <Typography className={classes.rankItem} component="h6" variant="h6">
                                                        {trackRanking}.&nbsp;
                                                        <Icon>
                                                            {track.platform.toLowerCase() === "spotify" ?
                                                                <img src="Spotify_icon.png" width="15px"
                                                                    height="15px"
                                                                    alt="Spotify" />
                                                                : track.platform.toLowerCase() === "soundcloud" ?
                                                                    <img src="SoundCloud_icon.png" width="15px"
                                                                        height="15px" alt="SoundCloud" />
                                                                    : null}
                                                        </Icon>
                                                    &nbsp; ({track.count}) {track.name}
                                                    </Typography>
                                                    <Typography className={classes.rankItem} variant="subtitle1" color="textSecondary">
                                                        {track.artist}
                                                    </Typography>

                                                </div>
                                            )
                                        })}

                                    </Container>
                                    <Container className={classes.middleRankItem}>
                                        <Typography className={classes.rankItem} component="h4" variant="h4">
                                            Artists
                                        </Typography>
                                        {artists.map((artist, index) => {
                                            let artistRanking = index + 1
                                            return (
                                                <div>
                                                    <Typography className={classes.rankItem} component="h6" variant="h6">
                                                        {artistRanking}. {artist.artist} ({artist.count})
                                                </Typography>
                                                    <Typography className={classes.rankItem} variant="subtitle1" color="textSecondary">
                                                        { }
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                    </Container>
                                    <Container className={classes.rightRankItem}>
                                        <Typography className={classes.rankItem} component="h4" variant="h4">
                                            Genres
                                        </Typography>
                                        {genres.map((genre, index) => {
                                            let genreRanking = index + 1
                                            return (
                                                <div>
                                                    <Typography className={classes.rankItem} component="h6" variant="h6">
                                                        {genreRanking}. {genre.genre} ({genre.count})
                                                </Typography>
                                                    <Typography className={classes.rankItem} variant="subtitle1" color="textSecondary">
                                                        { }
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                    </Container>
                                </CardContent>
                            </Card>
                        </Container>
                        <Container>
                            <Card className={classes.card} variant="outlined">
                                <Typography className={classes.favoriteTrack} variant="h3" color="textPrimary">
                                    Choose your favorite track!
                            </Typography>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-mutiple-name-label">Track</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        input={<Input />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0 || !favoriteTrack) {
                                                return <em>Choose track</em>
                                            }
                                            return favoriteTrack
                                        }}

                                        MenuProps={MenuProps}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        {userTracks.map(userTrack => {
                                            return <MenuItem value={userTrack.name + ' - ' + userTrack.artist + ' (' + userTrack.platform + ')'}
                                                onClick={() => handleFavoriteTrackChange(userTrack)}
                                            >{userTrack.name + ' - ' + userTrack.artist + ' (' + userTrack.platform + ')'} </MenuItem>
                                        }
                                        )}

                                    </Select>
                                </FormControl>
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
        activeUser: state.activeUser
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ redirect: redirect }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ProfileComponent);
