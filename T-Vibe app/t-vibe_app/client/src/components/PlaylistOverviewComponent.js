import React from "react";

import {connect} from "react-redux";
import {redirect, selectPlaylist} from "../actions";
import {bindActionCreators} from "redux";

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
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
}))

function PlaylistOverviewComponent(props) {

    const classes = useStyles()

    const createButtonSpacing = 2
    const playlistItemsSpacing = 4

    function handleCreateNewPlaylistClick() {
        props.selectPlaylist(null)
        props.redirect("CREATE_PLAYLIST")
    }

    function handlePlaylistClick(playlist) {
        props.selectPlaylist(playlist)
        props.redirect("VIEW_PLAYLIST")
    }

    function createListItems() {
        const beginItemIndex = 0
        const lastItemIndex = 5

        const xs = 12
        const sm = 6
        const md = 4
        
        return props.dbPlaylists.map(playlist => {
            return (
                <Grid item key={playlist._id} xs={xs} sm={sm} md={md}>
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.cardMedia}
                            image="https://source.unsplash.com/random"
                            title={playlist.name}
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
                                    playlist.tracks.slice(beginItemIndex,lastItemIndex).map(track => {
                                        return (
                                            <ListItem primary={track}>
                                                <ListItemIcon>
                                                    { track.platform.toLowerCase() === "spotify" ?    <img alt="Spotify icon" src="Spotify_icon.png" width="25px" height="25px"/>
                                                    : track.platform.toLowerCase() === "soundcloud" ? <img alt="SoundCloud icon" src="SoundCloud_icon.png" width="25px" height="25px"/>
                                                    : null}
                                                </ListItemIcon>
                                                <ListItemText secondary={track.name}/>
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

    return (
        <React.Fragment>
            <CssBaseline/>
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h4" variant="h4" align="center" color="textPrimary" name="playlistOverview" gutterBottom>
                            Playlist overview
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={createButtonSpacing} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary" name="createPlaylist" onClick={() => handleCreateNewPlaylistClick()}>
                                        Create new playlist
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={playlistItemsSpacing}>
                        {createListItems()}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        dbPlaylists: state.getPlaylists
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({selectPlaylist: selectPlaylist, redirect: redirect}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(PlaylistOverviewComponent);
