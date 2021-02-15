import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import CategoryIcon from "@material-ui/icons/Category";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SelectedCategoriesPanel(props) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {props.categories.map((category) => {
        return (
          <React.Fragment key={category + " ListItem"}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CategoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={category} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
}
