import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { useStyles } from './HeroRealmsTableStyles'
import HealthGoldCombatIndicator from './HealthGoldCombatIndicator';

interface OtherAreaProps {
  area: PlayerArea;
}

function OtherArea(props: OtherAreaProps) {

  const classes = useStyles();
  const area = props.area;

  return (
    <Grid item container xs className={classes.area}>
      <Box display="flex" flexGrow={1}>
        <Box display="flex" justifyContent="flex-start" alignItems="center" flexGrow={1} margin={1}>
          <Typography variant="h6">{area.playerName}</Typography>
        </Box>
      </Box>
      <HealthGoldCombatIndicator activePlayer={area.active} health={area.health} gold={area.gold} combat={area.combat}/>
    </Grid>  
  )
}

export default OtherArea