import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons'
import { GameParameter } from '../game/GameTypes'
import api, { GAMES_ENDPOINT, GAMES_LIST_ENDPOINT } from '../api/api'

const useStyles = makeStyles(theme => ({
  newGameButton: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(28),
  },
  newGameButtonIcon: {
    marginRight: theme.spacing(1),
  },
  selectGameImage: {
    height: "300px",
  },
}));

export function AddNewGameDialog() {
  
  const classes = useStyles();
  const [newGameDialogVisible, setNewGameDialogVisible] = useState(false);
  const [games, setGames] = useState<GameParameter[]>([]);
  const history = useHistory();

  function createNewGame(game: GameParameter) {
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
              <img src={game.image} alt={game.name} className={classes.selectGameImage}/>
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

const getGames = async ():Promise<GameParameter[]> => {

  let games:GameParameter[] = new Array(0);
  await api.get<GameParameter[]>(GAMES_LIST_ENDPOINT).then((response: { data: GameParameter[]; }) => {
    games = response.data;
  }).catch(error => {});

  return games;
}

interface CreateNewGameResponse {
  gameId: string,
}

const createNewGameServer = async (game: GameParameter):Promise<CreateNewGameResponse|null> => {

  let gameId = null;
  await api.post(GAMES_ENDPOINT, {game: game.id}).then((response: { data: CreateNewGameResponse }) => {
    gameId = response.data.gameId;
  }).catch(error => {});

  return gameId;
}

export default AddNewGameDialog