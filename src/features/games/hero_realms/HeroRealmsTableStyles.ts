import { makeStyles } from '@material-ui/core';
import { green, yellow, red } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  image: {
    width: "120px",
  },
  imageLarge: {
    width: "300px",
  },
  deckCount: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    right: "20px",
    top: "20px",
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: 12,
  },
  deckCountLeft: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    left: "20px",
    top: "20px",
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: 12,
  },
  area: {
    border: '1px solid',
    borderColor: theme.palette.primary.light,
  },
  endTurnButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  endTurnButtonIcon: {
    marginRight: theme.spacing(1),
  },
  health: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    color: 'black',
    backgroundColor: green[400],
  },
  gold: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    color: 'black',
    backgroundColor: yellow[600],
  },
  combat: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    color: 'black',
    backgroundColor: red[400],
  },
  popover: {
    pointerEvents: 'none',
  },
}));
