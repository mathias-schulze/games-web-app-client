import React from 'react'
import { Box, makeStyles } from '@material-ui/core';
import { HeroRealmsTableView, PlayerArea } from './HeroRealmsTypes'
import HealthGoldCombatIndicator from './HealthGoldCombatIndicator';
import PlayedChampions from './PlayedChampions';
import { PlayerDecksAndCards, playerColors, Deck } from './HeroRealmsTable';

export const useStyles = makeStyles({
  otherArea: {
    display: "flex",
    flexGrow: 1,
    flexFlow: "column wrap",
    alignSelf: "flex-start",
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
  observer: boolean;
}

function OtherArea(props: OtherAreaProps) {

  const classes = useStyles();
  const area = props.area;

  return (
    <Box className={classes.otherArea} style={{backgroundColor: playerColors[area.position]}}>
      <HealthGoldCombatIndicator id={props.id} area={area} availableCombat={props.availableCombat} observer={props.observer}/>
      <Box className={classes.cards}>
        <Deck alt="hand" count={area.handSize} 
            image={props.table.cardBack} emptyImage={props.table.emptyDeck}
            onClick={() => {}} disabled={true}/>
        <PlayerDecksAndCards {...props}/>
      </Box>
      <PlayedChampions id={props.id} area={area} justifyContent={props.justifyContent} 
          attack availableCombat={props.availableCombat} observer={props.observer}/>
    </Box>  
  )
}

export default OtherArea
