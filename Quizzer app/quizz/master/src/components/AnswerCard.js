import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 400
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


export default function AnswerCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
          <CardContent key={props.answer}>
            <Typography className="TypoGrapgy" color="textSecondary" gutterBottom>
              Correct answer
            </Typography>
            <Typography variant="h5" component="h2">
              {props.answer}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" target="_blank" href={`https://www.google.com/search?q=${props.answer}`}>Learn More</Button>
          </CardActions>
        </Card>
      );
}
