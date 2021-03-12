import React from 'react'
import { Box, makeStyles, Paper } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { Card, playerColors } from './HeroRealmsTable';

export const useStyles = makeStyles({
  playedCards: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
  },
  emptyCard: {
    height: "166px",
  },
});

export interface PlayedCardsProps {
  id: string;
  area: PlayerArea;
  justifyContent: string;
}

function PlayedCards(props: PlayedCardsProps) {

  const classes = useStyles();

  return (
    <Box className={classes.playedCards} justifyContent={props.justifyContent}
        style={{backgroundColor: playerColors[props.area.position]}}>
      {props.area.playedCards.length === 0 &&
        <Paper className={classes.emptyCard}/>
      }
      {props.area.playedCards.map(card => {
        return (
          <Card key={"playedCard"+card.id} alt={card.name} image={card.image}
              onClick={() => {}} disabled={true}/>
        )})
      }
    </Box>
  )
}

export default PlayedCards
