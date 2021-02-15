import React, {useEffect, useState} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {friend, friends, logIn, redirect, selectPlaylist} from "../actions";
import {getRandomPlaylistsByUserId, getResultsBasedOnSearchTerm} from "../components/helpers/SearchComponentHelper";

import {Avatar, Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import SearchBar from 'material-ui-search-bar';

const useStyles = makeStyles((theme) => ({
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
    flexCardColumn: {
        display: "flex",
        flexDirection: "column",
    },
    flexCardRowUser: {
        display: "flex",
        flexDirection: "row",
    },
    userAvatar: {
        height: '150px',
        width: '150px'
    },
    viewProfileButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    enabledButton: {
        display: 'block'
    },
}))

function SearchComponent(props) {
    const classes = useStyles()

    const [searchResults, setSearchResults] = useState({ playlists: [], users: [] })
    const [noPlaylistResultsFound, setNoPlaylistResultsFound] = useState('')
    const [noUserResultsFound, setNoUserResultsFound] = useState('')

    const searchResultsSpacing = 4
    const xs = 12
    const sm = 6

    const username = props.activeUser.username

    function handlePlaylistClick(playlist) {
        props.selectPlaylist(playlist)
        props.redirect("VIEW_PLAYLIST")
    }
    
    async function getSearchResults(searchTerm) {
        return await getResultsBasedOnSearchTerm(searchTerm)
    }

    async function getRandomPlaylists(userId) {
        return await getRandomPlaylistsByUserId(userId)
    }

    function PlaylistSearchResults() {

        const [playlistResultMessage, setPlaylistResultMessage] = useState([])

        async function getPlaylistSearchResults() {

            let playlistSearchResults = null

            if (searchResults.playlists[0] === undefined) {
                playlistSearchResults = createPlaylistResults(props.dbPlaylists)
                setPlaylistResultMessage(playlistSearchResults)
            }

            if (searchResults) {
                if (searchResults.playlists) {
                    if (searchResults.playlists[0] !== undefined) {
                        if (searchResults.playlists[0].length === 0) {
                            const randomPlaylists = await getRandomPlaylists(props.activeUser._id)
                            playlistSearchResults = createPlaylistResults(randomPlaylists)
                        }
                        else {
                            playlistSearchResults = createPlaylistResults(searchResults.playlists[0])

                        }
                        setPlaylistResultMessage(playlistSearchResults)
                    }
                }
            }
        }
        useEffect(() => {
            getPlaylistSearchResults()
        }, [])

        return playlistResultMessage
    }

    function NoPlaylistSearchResultsFound() {
        if (searchResults) {
            if (searchResults.playlists) {
                if (searchResults.playlists[0] !== undefined) {
                    if (searchResults.playlists[0].length === 0) {
                        setNoPlaylistResultsFound("There were no playlists found using those search terms, here are some suggestions:")
                    } else {
                        setNoPlaylistResultsFound("")
                    }
                }
            }
        }

        return noPlaylistResultsFound
    }


    function UserSearchResults() {

        const [userResultMessage, setUserResultMessage] = useState(null)

        async function getUserSearchResults() {

            if (searchResults) {
                if (searchResults.users) {
                    if (searchResults.users[0] !== undefined) {
                        if (searchResults.users[0].length === 0) {
                            setUserResultMessage("")
                        }
                        else {
                            const userSearchResults = createUserResults(props)
                            setUserResultMessage(userSearchResults)
                        }
                    }
                }
            }
        }
        useEffect(() => {
            getUserSearchResults()
        }, [])

        return userResultMessage
    }

    function NoUserSearchResultsFound() {
        if (searchResults) {
            if (searchResults.users) {
                if (searchResults.users[0] !== undefined) {
                    if (searchResults.users[0].length === 0) {
                        setNoUserResultsFound("There were no users found using those search terms.")
                    } else {
                        setNoUserResultsFound("")
                    }
                }
            }
        }

        return noUserResultsFound
    }



    async function searchOnRequestSearch(e) {

        await getSearchResults(e).then(response => {
            const newState = { ...searchResults }
            newState.playlists.push(response.playlists)
            newState.users.push(response.users)
            setSearchResults({ playlists: newState.playlists, users: newState.users })
        })
    }

    async function onProfileClick(user){
        props.friend(user)
        props.redirect("PROFILE")
    }

    function createPlaylistResults(playlistArray) {
        if (playlistArray == null) {
            return ""
        }
        else {
            return playlistArray.map(playlist => {
                return (
                    <Grid item xs={xs} sm={sm} md={4}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.cardMedia}
                                image="https://source.unsplash.com/random"
                                title={"TestUserTitle"}
                            />
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {playlist.name}
                                </Typography>
                                <Typography>
                                    {playlist.description}
                                </Typography>
                                <List component="nav" aria-label="main mailbox folders">
                                    {
                                        playlist.tracks.slice(0, 4).map(track => {
                                            return (
                                                <ListItem primary={track}>
                                                    <ListItemIcon>
                                                        {track.platform.toLowerCase() === "spotify" ?
                                                            <img alt="Spotify icon" src="Spotify_icon.png" width="25px"
                                                                 height="25px"/>
                                                            : track.platform.toLowerCase() === "soundcloud" ?
                                                                <img alt="SoundCloud icon" src="SoundCloud_icon.png"
                                                                     width="25px" height="25px"/>
                                                                : null}
                                                    </ListItemIcon>
                                                    <ListItemText secondary={track.name} />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" size="small" color="primary"
                                    onClick={() => handlePlaylistClick(playlist)}>
                                    View
                            </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )
            })
        }
    }

    function createUserResults(props) {
        return searchResults.users[0].map(user => {
            if (user.username !== props.activeUser.username) {
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
                                <Button className={classes.viewProfileButton} name="profileButton" variant="contained" size="small" color="primary"
                                    onClick={() => onProfileClick(user)}>
                                    View Profile
                            </Button>
                            </Container>
                        </Container>
                    </Grid>
                )
            }
        })
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.heroContent}>
                    <Container>
                        <Typography component="h4" variant="h4" align="center" color="textPrimary" name="searchHeader" gutterBottom>
                            Search
                        </Typography>
                        <SearchBar 
                            placeholder="Search for playlists and/or users"
                            name="Search"
                            onChange={() => { setSearchResults({ playlists: [], users: [] }) }}
                            onRequestSearch={(e) => searchOnRequestSearch(e)}
                            style={{
                                margin: '0 auto',
                                maxWidth: 800
                            }
                            }
                        />
                    </Container>
                </div>

                <Container className={classes.cardGrid} maxWidth="md">
                    <Typography component="h4" variant="h4">Playlists</Typography>
                    <Typography className={classes.noResultsFoundMessage}>
                        <NoPlaylistSearchResultsFound />
                    </Typography>
                    <Grid container spacing={searchResultsSpacing}>
                        <PlaylistSearchResults />
                    </Grid>
                </Container>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Typography component="h4" variant="h4">Users</Typography>
                    <Typography className={classes.noResultsFoundMessage}>
                        <NoUserSearchResultsFound />
                    </Typography>
                    <Grid container spacing={searchResultsSpacing}>
                        <UserSearchResults />
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
        connections: state.activeUser.connections,
        dbPlaylists: state.getPlaylists
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ selectPlaylist: selectPlaylist, friends: friends, friend: friend, redirect: redirect, logIn: logIn }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(SearchComponent);