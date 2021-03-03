import React from 'react'
import { Grid } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { useStyles } from './HeroRealmsTableStyles'
import { Card } from './HeroRealmsTable';

export interface PlayedCardsProps {
  id: string;
  area: PlayerArea;
}

function PlayedCards(props: PlayedCardsProps) {

  const classes = useStyles();

  return (
    <Grid item container xs={12} wrap="nowrap" className={classes.area}>
      {props.area.playedCards.map(card => {
        return (
          <Grid item xs key={"playedCardGrid"+card.id}>
            <Card key={"playedCard"+card.id} alt={card.name} image={card.image}
                onClick={() => {}} disabled={true}/>
          </Grid>
        )})
      }
    </Grid>
  )
}

export default PlayedCards
