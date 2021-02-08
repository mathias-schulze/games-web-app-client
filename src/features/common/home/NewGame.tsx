import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons'
import { Game } from '../game/GameTypes'
import api, { GAMES_ENDPOINT, GAMES_LIST_ENDPOINT } from '../api/api'

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
    const gameId = createNewGameServer(game).then(gameId => {return gameId});
    setNewGameDialogVisible(false)
    gameId.then(id => {
      history.push("/game/" + id);
    })
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
  await api.get<Game[]>(GAMES_LIST_ENDPOINT).then((response: { data: Game[]; }) => {
    games = response.data;
  }).catch(error => {});

  return games;
}

interface CreateNewGameResponse {
  gameId: string,
}

const createNewGameServer = async (game: Game):Promise<CreateNewGameResponse|null> => {

  let gameId = null;
  await api.post(GAMES_ENDPOINT, {game: game.id}).then((response: { data: CreateNewGameResponse }) => {
    gameId = response.data.gameId;
  }).catch(error => {});

  return gameId;
}

export default NewGame