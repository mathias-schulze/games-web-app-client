import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons'
import { firestore, COLLECTION_GAMES } from '../firebase/Firebase'
import { games, Game, Stage } from '../Const'

const useStyles = makeStyles(theme => ({
  newGameButton: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  newGameButtonIcon: {
    marginRight: theme.spacing(1),
  },
}));

export function NewGame() {
  
  const classes = useStyles();
  const [newGameDialogVisible, setNewGameDialogVisible] = useState(false);
  const history = useHistory();

  function createNewGame(game: Game) {
    setNewGameDialogVisible(false)

    firestore.collection(COLLECTION_GAMES).add({
      game: game.id,
      stage: Stage[Stage.NEW],
    }).then(function(docRef) {
      const gameId = docRef.id;
      history.push("/game/" + gameId);
    }).catch(function(error) {
      console.log("Error adding document:", error);
    });    
  }

  return (
    <div>
      <Dialog open={newGameDialogVisible} maxWidth="lg" onClose={() => setNewGameDialogVisible(false)}>
        <DialogTitle>
          Spiel auswählen
        </DialogTitle>
        <DialogContent>
          {games.map(game => {
            return <Button onClick={() => createNewGame(game)} key={"select" + game.id + "Button"}>
              <img src={game.image} alt={game.name}/>
            </Button>
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewGameDialogVisible(false)} color="primary">
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
      <Fab variant="extended" color="primary" className={classes.newGameButton} onClick={() => setNewGameDialogVisible(true)}>
        <Add className={classes.newGameButtonIcon}/>
        Neues Spiel
      </Fab>
    </div>
  )
}

export default NewGame