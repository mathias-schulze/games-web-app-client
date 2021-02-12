import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom';
import { Paper, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Box, Fab, makeStyles } from '@material-ui/core'
import { PlayArrow, Refresh } from '@material-ui/icons'
import moment from 'moment'
import api, { GAMES_ACTIVE_ENDPOINT } from '../api/api'
import { isConnected } from '../api/apiSlice'
import { ActiveGame } from '../game/GameTypes'

const useStyles = makeStyles(theme => ({
  refreshButton: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  refreshButtonIcon: {
    marginRight: theme.spacing(1),
  },
}));

function GameList() {
  
  const classes = useStyles();
  const connected = useSelector(isConnected);
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (connected) {
      refreshGameList();
    }
  }, [connected]);
  
  const refreshGameList = () => {
    api.get<ActiveGame[]>(GAMES_ACTIVE_ENDPOINT).then((response: { data: ActiveGame[]; }) => {
      setActiveGames(response.data)
    }).catch(error => {});
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Spiel</TableCell>
              <TableCell>Angelegt</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeGames.map((game: ActiveGame) => (
              <TableRow key={"activeGame"+game.id}>
                <TableCell>{game.game + " (#" + game.no + ")"}</TableCell>
                <TableCell>{moment(game.created).format('L')}</TableCell>
                <TableCell>
                  <Box m={-2} pt={-2}>
                    <IconButton edge="end" onClick={(e: React.SyntheticEvent) => {
                        e.preventDefault();
                        history.push("/game/" + game.id);
                      }}>
                      <PlayArrow fontSize="large"/>
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {activeGames.length === 0 &&
              <TableRow key="noActiveGame">
                <TableCell colSpan={3} align="center">Keine aktiven Spiele</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Fab variant="extended" color="primary" className={classes.refreshButton} onClick={() => refreshGameList()}>
        <Refresh className={classes.refreshButtonIcon}/>
        Aktualisieren
      </Fab>
    </div>
  )
}

export default GameList
