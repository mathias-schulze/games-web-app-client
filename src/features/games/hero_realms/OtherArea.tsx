import React from 'react'
import { Box, makeStyles } from '@material-ui/core';
import { HeroRealmsTableView, PlayerArea } from './HeroRealmsTypes'
import HealthGoldCombatIndicator from './HealthGoldCombatIndicator';
import PlayedChampions from './PlayedChampions';
import { PlayerDeckAndDiscard, playerColors } from './HeroRealmsTable';

export const useStyles = makeStyles({
  otherArea: {
    display: "flex",
    flexGrow: 1,
    flexFlow: "column wrap",
  },
  cards: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    width: "100%",
  },
});

interface OtherAreaProps {
  id: string;
  table: HeroRealmsTableView;
  area: PlayerArea;
  justifyContent: string;
  availableCombat: number;
}

function OtherArea(props: OtherAreaProps) {

  const classes = useStyles();
  const area = props.area;

  return (
    <Box className={classes.otherArea} style={{backgroundColor: playerColors[area.position]}}>
      <HealthGoldCombatIndicator id={props.id} area={area} availableCombat={props.availableCombat}/>
      <Box className={classes.cards}>
        <PlayedChampions id={props.id} area={area} justifyContent={props.justifyContent} 
            attack availableCombat={props.availableCombat}/>
        <PlayerDeckAndDiscard table={props.table} area={area}/>
      </Box>
    </Box>  
  )
}

export default OtherArea
