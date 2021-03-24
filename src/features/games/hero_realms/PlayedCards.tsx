import React from 'react'
import { Box, makeStyles, Paper } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { Card, playerColors } from './HeroRealmsTable';
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_SACRIFICE_CARD_ENDPOINT,  } from '../../common/api/api';

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
  own?: boolean;
  justifyContent: string;
}

function PlayedCards(props: PlayedCardsProps) {

  const classes = useStyles();

  const sacrificeCard = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_SACRIFICE_CARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Box className={classes.playedCards} justifyContent={props.justifyContent}
        style={{backgroundColor: playerColors[props.area.position]}}>
      {props.area.playedCards.length === 0 &&
        <Paper className={classes.emptyCard}/>
      }
      {props.area.playedCards.map(card => {
        const sacrifice = (props.own && card.sacrifice);
        return (
          <Card key={"playedCard"+card.id} alt={card.name} image={card.image}
              onClick={() => {sacrificeCard(card.id)}} disabled={!sacrifice} ready sacrifice={sacrifice}/>
        )})
      }
    </Box>
  )
}

export default PlayedCards
