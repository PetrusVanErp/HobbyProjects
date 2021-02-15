import React from "react";

import Link from '@material-ui/core/Link';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                T-Vibe
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    }
}))

function FooterComponent() {
    const classes = useStyles()

    return (
        <React.Fragment>
            <footer className={classes.footer}>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    T-Vibe is owned by the awesome developers Vu, Ruben, Diego and Pepijn
                </Typography>
                <Copyright />
            </footer>
        </React.Fragment>
    )
}

export default FooterComponent;