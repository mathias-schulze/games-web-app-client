import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core';
import { HeroRealmsTableViewProps } from './HeroRealmsTypes'
import { useStyles } from './HeroRealmsTableStyles'
import { Card, Deck } from './HeroRealmsTable';

function CommonArea(props: HeroRealmsTableViewProps) {

  const classes = useStyles();
  const fireGemsCount = props.table.fireGemsDeck.size;
  const fireGemsImage = (fireGemsCount > 0) ? props.table.fireGemsDeck.cards[0].image : "";

  return (
    <Grid item container xs={12} wrap="nowrap" className={classes.area}>
      <Grid item xs>
        <Deck key="fireGemsDeck" alt="fire gems deck" count={fireGemsCount} 
            image={fireGemsImage} emptyImage={props.table.emptyDeck}
            onClick={() => {}} disabled={!props.table.ownPlayerArea.active}/>
      </Grid>
      <Market table={props.table}/>
      <Grid item>
        <Deck key="marketDeck" alt="market deck" count={props.table.marketDeck.size} 
            image={props.table.cardBack} emptyImage={props.table.emptyDeck}
            onClick={() => {}} disabled={true}/>
      </Grid>
    </Grid>
  )
}

function Market(props: HeroRealmsTableViewProps) {

  return (
    <Fragment>
      {props.table.market.map(marketCard => {
        return (
          <Grid item xs>
            <Card key={"marketCard"+props.table.market.indexOf(marketCard)} alt={marketCard.name} image={marketCard.image}
                onClick={() => {}} disabled={!props.table.ownPlayerArea.active}/>
          </Grid>
        )})
      }
    </Fragment>
  )
}

export default CommonArea
