import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { Paper, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Box, Fab, makeStyles, Avatar, Tooltip, Switch } from '@material-ui/core'
import { Star, Group, PlayArrow, Refresh, Delete } from '@material-ui/icons'
import { green, orange } from '@material-ui/core/colors';
import { AvatarGroup } from '@material-ui/lab';
import moment from 'moment'
import api, { GAMES_ENDPOINT, GAMES_TABLES_ENDPOINT } from '../api/api'
import { isConnected } from '../api/apiSlice'
import { GameTable } from '../game/GameTypes'
import { getAuth } from '../auth/authSlice';
import { Stage } from '../Const';

const useStyles = makeStyles(theme => ({
  refreshButton: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  refreshButtonIcon: {
    marginRight: theme.spacing(1),
  },
  playerAvatar: {
    backgroundColor: green[500],
  },
  playerAvatarActive: {
    backgroundColor: orange[500],
  },
}));

function GameList() {
  
  const classes = useStyles();
  const connected = useSelector(isConnected);
  const auth = useSelector(getAuth);
  const [hideFinished, setHideFinished] = useState(true);
  const [tables, setTables] = useState<GameTable[]>([]);
  const visibleTables = tables.filter(table => !hideFinished || table.stage !== Stage.FINISHED);
  const history = useHistory();

  useEffect(() => {
    if (connected) {
      refreshGameList();
    }
  }, [connected]);
  
  const refreshGameList = () => {
    api.get<GameTable[]>(GAMES_TABLES_ENDPOINT).then((response: { data: GameTable[]; }) => {
      setTables(response.data)
    }).catch(error => {});
  }

  const handleHideFinishedSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHideFinished(event.target.checked);
  };

  const deleteGame = async (gameId: string) => {
    await api.delete(GAMES_ENDPOINT + "/" + gameId)
        .then()
        .catch(error => {});
    refreshGameList();
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Spiel</TableCell>
              <TableCell>Angelegt</TableCell>
              <TableCell>Spieler</TableCell>
              <TableCell>
                <Switch
                  checked={hideFinished}
                  onChange={handleHideFinishedSwitch}
                  name="hideFinishedSwitch"
                  color="primary"/>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleTables.map((game: GameTable) => (
              <TableRow key={"gameTable"+game.id}>
                <TableCell>{game.game + " (#" + game.no + ")"}</TableCell>
                <TableCell>{moment(game.created).format('L')}</TableCell>
                <TableCell>
                  <AvatarGroup>
                    {game.players.map(player => {
                      const className = (player.id === auth?.uid) ? classes.playerAvatarActive : classes.playerAvatar;
                      return (
                        <Tooltip key={"playerAvatar" + player.id} title={player.name} placement="bottom">
                          <Avatar alt={player.name} className={className}>{player.name.charAt(0)}</Avatar>
                        </Tooltip>
                      )
                    })}
                  </AvatarGroup>
                </TableCell>
                <TableCell>
                  <Box m={-2} pt={-2}>
                    {(game.stage === Stage.NEW || game.players.filter(player => player.id === auth?.uid).length > 0) &&
                      <IconButton edge="end" onClick={(e: React.SyntheticEvent) => {
                            e.preventDefault();
                            history.push("/game/" + game.id);
                          }}>
                        {game.stage === Stage.NEW && <Group/>}
                        {game.stage === Stage.RUNNING && <PlayArrow/>}
                        {game.stage === Stage.FINISHED && <Star/>}
                      </IconButton>
                    }
                    {game.stage === Stage.FINISHED &&
                      <IconButton edge="end" onClick={() => deleteGame(game.id)}>
                        <Delete/>
                      </IconButton>
                    }
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {visibleTables.length === 0 &&
              <TableRow key="noActiveGame">
                <TableCell colSpan={3} align="center">Keine {hideFinished ? 'aktiven ' : ''}Spiele</TableCell>
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
