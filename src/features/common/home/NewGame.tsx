import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons'
import { firestore, COLLECTION_GAMES } from '../firebase/Firebase'
import { Stage } from '../Const'
import { Game } from '../game/GameTypes'
import api, { GAMES_LIST_ENDPOINT } from '../api/api'

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
  const [games, setGames] = useState<Game[]>([]);
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

  useEffect(() => {
    getGames().then(gameList => setGames(gameList));
  }, [])

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

const getGames = async ():Promise<Game[]> => {

  let games:Game[] = new Array(0);
  try {
    await api.get<Game[]>(GAMES_LIST_ENDPOINT).then((response: { data: Game[]; }) => {
      games = response.data;
    })
  } catch (error) {
    console.error(error);
  }

  return games;
}

export default NewGame