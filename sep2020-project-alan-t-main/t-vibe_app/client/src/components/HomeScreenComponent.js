import React from "react";

import RadioComponent from './RadioComponent';
import FriendsActivityComponent from './FriendsActivityComponent';
import TrendingComponent from './TrendingComponent';

import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    flexContainer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 2),
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: theme.spacing(4),
    },
    leftFlexItem: {
        order: 1,
        maxWidth: '25%'
    },
    middleFlexItem: {
        order: 2,
        maxWidth: '50%'
    },
    rightFlexItem: {
        order: 3,
        maxWidth: '25%',
    },
    scrollable: {
        maxHeight: "500px",
        overflowY: "scroll"
    }
}))

function HomeScreenComponent() {
    const classes = useStyles()

    return (
        <React.Fragment>
            <CssBaseline/>
            <Typography component="h4" variant="h4" align="center" color="textPrimary" name="welcome" gutterBottom>
                Welcome to T-Vibe!
            </Typography>
            <Typography component="h7" variant="h7" align="center" color="textPrimary" name="welcomeMessage"
                        gutterBottom>
                In this streaming service, you can create playlists with tracks from Spotify and SoundCloud!<br></br>
                Follow your friends to explore more music than ever!
            </Typography>

            <Container className={classes.flexContainer}>
                <Container className={classes.leftFlexItem}>
                    <RadioComponent/>
                </Container>
                <Container className={classes.middleFlexItem}>
                    <Typography variant="h3">
                        Trending
                    </Typography>
                    <Container>
                        <TrendingComponent/>
                    </Container>
                </Container>
                <Container className={classes.rightFlexItem}>
                    <FriendsActivityComponent/>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default HomeScreenComponent;