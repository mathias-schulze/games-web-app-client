import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { Paper, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, IconButton, Box } from '@material-ui/core'
import { PlayArrow } from '@material-ui/icons'
import moment from 'moment'
import api, { GAMES_ACTIVE_ENDPOINT } from '../api/api'
import { isConnected } from '../api/apiSlice'
import { ActiveGame } from '../game/GameTypes'

function GameList() {
  
  const connected = useSelector(isConnected);
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const history = useHistory();

  useEffect(() => {
    if (connected) {
      api.get<ActiveGame[]>(GAMES_ACTIVE_ENDPOINT).then((response: { data: ActiveGame[]; }) => {
        setActiveGames(response.data)
      }).catch(error => {});
    }
  }, [connected]);

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
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default GameList
