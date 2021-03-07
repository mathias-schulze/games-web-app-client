import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core';
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_BUY_MARKET_CARD_ENDPOINT, HERO_REALMS_BUY_FIRE_GEM_ENDPOINT } from '../../common/api/api';
import { HeroRealmsTableViewProps } from './HeroRealmsTypes'
import { useStyles } from './HeroRealmsTableStyles'
import { Card, Deck } from './HeroRealmsTable';

function CommonArea(props: HeroRealmsTableViewProps) {

  const classes = useStyles();
  const fireGemsCount = props.table.fireGemsDeck.size;
  const fireGemsImage = (fireGemsCount > 0) ? props.table.fireGemsDeck.cards[0].image : "";

  const buyFireGem = async () => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_BUY_FIRE_GEM_ENDPOINT)
        .then()
        .catch(error => {});
  }

  return (
    <Grid item container xs={12} wrap="nowrap" className={classes.area}>
      <Grid item xs>
        <Deck key="fireGemsDeck" alt="fire gems deck" count={fireGemsCount} counterLeft
            image={fireGemsImage} emptyImage={props.table.emptyDeck}
            onClick={() => {buyFireGem()}} disabled={!props.table.ownPlayerArea.active}/>
      </Grid>
      <Market id={props.id} table={props.table}/>
      <Grid item>
        <Deck key="marketDeck" alt="market deck" count={props.table.marketDeck.size} 
            image={props.table.cardBack} emptyImage={props.table.emptyDeck}
            onClick={() => {}} disabled={true}/>
      </Grid>
    </Grid>
  )
}

function Market(props: HeroRealmsTableViewProps) {

  let index = 0;

  const buyCard = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_BUY_MARKET_CARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Fragment>
      {props.table.market.map(marketCard => {
        index++;
        const id = (marketCard === null ? "empty" + index : marketCard.id);
        const name = (marketCard === null ? "empty market " + index : marketCard.name);
        const image = (marketCard === null ? props.table.emptyDeck : marketCard.image);
        const disabled = (marketCard === null ? true : !props.table.ownPlayerArea.active);

        return (
          <Grid item xs key={"marketCardGrid"+id}>
            <Card key={"marketCard"+id} alt={name} image={image}
                onClick={() => {buyCard(id)}} disabled={disabled}/>
          </Grid>
        )})
      }
    </Fragment>
  )
}

export default CommonArea
