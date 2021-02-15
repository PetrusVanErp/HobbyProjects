import React from "react";

import {redirect} from "../actions";
import {connect} from "react-redux";
import {getUserAccess} from "./connections/SpotifyHandler";
import {bindActionCreators} from "redux";

import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 2),
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    flexBoxCards: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
}))

function SettingsComponent(props) {
    const classes = useStyles()

    const xs = 12
    const sm = 6
    const md = 4

    function createListItems(platforms = ['Spotify', 'SoundCloud']) {
        return platforms.map(p => {
            //Check whether a connection is already activated
            const isEnabled = (props.connections.length === 0) || (!props.connections.find(c => c.platform.toLowerCase() === p.toLowerCase()))
            if (p !== "SoundCloud") {
                return (
                    <Grid item xs={xs} sm={sm} md={md}>
                        <Card className={classes.card}>
                            <CardContent className={classes.cardContent}>
                                <img src={p + '_icon.png'} alt={p} />
                                <Typography>
                                    {p}
                                </Typography>
                                <Button variant="contained" color="primary" disabled={!isEnabled} onClick={() => getUserAccess()}>
                                    {!isEnabled ? "Connected" : "Connect"}
                                </Button>
                            </CardContent>
                        </Card>
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
                        <Typography component="h4" variant="h4" align="center" color="textPrimary" gutterBottom>
                            Settings
                        </Typography>
                    </Container>
                </div>
                <Container className={classes.flexBoxCards} align="center">
                        {createListItems()}
                </Container>
            </main>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        connections: state.activeUser.connections
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ redirect: redirect }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(SettingsComponent);