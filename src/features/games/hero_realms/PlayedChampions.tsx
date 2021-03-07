import React from 'react'
import { Grid } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { useStyles } from './HeroRealmsTableStyles'
import { Card } from './HeroRealmsTable';

export interface PlayedChampionsProps {
  id: string;
  area: PlayerArea;
}

function PlayedChampions(props: PlayedChampionsProps) {

  const classes = useStyles();

  return (
    <Grid item container xs={12} wrap="nowrap" className={classes.area}>
      {props.area.champions.map(champion => {
        return (
          <Grid item xs key={"playedChampionsGrid"+champion.id}>
            <Card key={"playedChampion"+champion.id} alt={champion.name} image={champion.image}
                onClick={() => {}} disabled={true}/>
          </Grid>
        )})
      }
    </Grid>
  )
}

export default PlayedChampions
