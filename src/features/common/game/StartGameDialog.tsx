import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Paper, TableContainer, Table, TableBody, TableCell, TableRow, makeStyles } from '@material-ui/core';
import { GameParameter, ActiveGame, Player } from '../game/GameTypes'
import api, { GAMES_ENDPOINT, GAMES_PARAM_ENDPOINT, GAMES_JOIN_ENDPOINT, GAMES_START_ENDPOINT, PLAYERS_ENDPOINT } from '../api/api';
import { firestore, COLLECTION_GAMES } from '../firebase/Firebase';
import { getAuth } from '../auth/authSlice'
import firebase from 'firebase';

export const useStyles = makeStyles({
  startDialogContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  backdrop: {
    position: 'absolute',
  },
});

interface StartGameProps {
    id: string;
}

function StartGameDialog(props: StartGameProps) {

  const classes = useStyles();
  const [game, setGame] = useState<ActiveGame|undefined>(undefined);
  const [gameParams, setGameParams] = useState<GameParameter|undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const userId = useSelector(getAuth)?.uid;
  const [joinButtonDisabled, setJoinButtonDisabled] = useState<boolean>(true);
  const [startButtonDisabled, setStartButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = firestore.collection(COLLECTION_GAMES).doc(props.id).onSnapshot((doc) => {
      const data = doc.data();
      if (data) {
        setGame({id: doc.id, no: data.no, created: data.created, 
          game: data.game, stage: data.stage, players: data.players
        });
        
        let minPlayer = 0;
        let maxPlayer = 0;
        const loadPlayerData = async (data: firebase.firestore.DocumentData) => {
          await api.get<GameParameter>(GAMES_PARAM_ENDPOINT + '?id=' + data.game)
              .then((response: { data: GameParameter; }) => {
            minPlayer = response.data.minPlayer;
            maxPlayer = response.data.maxPlayer;
            setGameParams(response.data)
          }).catch(error => {});
          
          await api.get<Player[]>(PLAYERS_ENDPOINT + '?ids=' + data.players.join(","))
              .then((response: { data: Player[]; }) => {
            const playersData = response.data;
            setStartButtonDisabled(playersData.length < minPlayer);
            for (let i = playersData.length; i < maxPlayer; i++) {
              playersData.push({id: "free"+i, name: (i < minPlayer ? "notwendig" : "frei")})
            }
            setPlayers(playersData);
          }).catch(error => {});
        }

        loadPlayerData(data);
        setJoinButtonDisabled(data.players.includes(userId));
      }
    });
    
    return () => {unsubscribe()}
  }, [props.id, userId])
  
  const joinGame = async () => {

    await api.post(GAMES_ENDPOINT + '/' + props.id + GAMES_JOIN_ENDPOINT)
        .then()
        .catch(error => {});
    
    setJoinButtonDisabled(true);
  }

  const startGame = async () => {

    await api.post(GAMES_ENDPOINT + '/' + props.id + GAMES_START_ENDPOINT)
        .then()
        .catch(error => {});

    setStartButtonDisabled(true);
  }

  return (
    <div className={classes.startDialogContainer}>
      <Dialog open={true} maxWidth="lg" disablePortal
          style={{ position: "absolute" }}
          BackdropProps={{ classes: { root: classes.backdrop } }}>
        <DialogTitle>{gameParams?.name + " (#" + game?.no + ")"}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {players.map((player: Player) => (
                  <TableRow key={"player"+player.id}>
                    <TableCell>{player.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <DialogActions>
            <Button disabled={joinButtonDisabled} variant="contained" color="primary"
                onClick={() => {joinGame()}}>
              Beitreten
            </Button>
            <Button disabled={startButtonDisabled} variant="contained" color="primary"
                onClick={() => {startGame()}}>
              Starten
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StartGameDialog
