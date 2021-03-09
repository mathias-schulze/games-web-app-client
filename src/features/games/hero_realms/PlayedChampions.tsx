import React from 'react'
import { Box, makeStyles } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { Card } from './HeroRealmsTable';

export const useStyles = makeStyles({
  playedCahmpions: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
  },
});

export interface PlayedChampionsProps {
  id: string;
  area: PlayerArea;
  justifyContent: string;
}

function PlayedChampions(props: PlayedChampionsProps) {

  const classes = useStyles(props);

  return (
    <Box>
      <Box className={classes.playedCahmpions} justifyContent={props.justifyContent}>
        {props.area.champions.map(champion => {
          return (
            <Card key={"playedChampion"+champion.id} alt={champion.name} image={champion.image}
                onClick={() => {}} disabled={true}/>
          )})
        }
      </Box>
    </Box>
  )
}

export default PlayedChampions
