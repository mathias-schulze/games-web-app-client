import React, { Fragment } from 'react'
import { Avatar, Box } from '@material-ui/core';
import { useStyles } from './HeroRealmsTableStyles'

interface HealthGoldCombatIndicatorProps {
    activePlayer: boolean;
    health: number;
    gold: number;
    combat: number;
}

function HealthGoldCombatIndicator(props: HealthGoldCombatIndicatorProps) {

  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="flex-end">
      <Avatar className={classes.health}>{props.health}</Avatar>
      {props.activePlayer &&
        <Fragment>
          <Avatar className={classes.gold}>{props.gold}</Avatar>
          <Avatar className={classes.combat}>{props.combat}</Avatar>
        </Fragment>
      }
    </Box>
  )
}

export default HealthGoldCombatIndicator
