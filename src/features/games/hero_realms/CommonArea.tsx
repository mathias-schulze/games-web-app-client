import React from 'react'
import { Box, makeStyles } from '@material-ui/core';
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_BUY_MARKET_CARD_ENDPOINT, HERO_REALMS_BUY_FIRE_GEM_ENDPOINT } from '../../common/api/api';
import { HeroRealmsTableViewProps } from './HeroRealmsTypes'
import { Card, Deck } from './HeroRealmsTable';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  commonArea: {
    width: "100%",
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  market: {
    display: "flex",
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
}));

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
    <Box className={classes.commonArea} style={{backgroundColor: grey[400]}}>
      <Deck key="fireGemsDeck" alt="fire gems deck" count={fireGemsCount} counterLeft
          image={fireGemsImage} emptyImage={props.table.emptyDeck}
          onClick={() => {buyFireGem()}} disabled={!props.table.ownPlayerArea.active}/>
      <Market id={props.id} table={props.table}/>
      <Deck key="marketDeck" alt="market deck" count={props.table.marketDeck.size} 
          image={props.table.cardBack} emptyImage={props.table.emptyDeck}
          onClick={() => {}} disabled={true}/>
    </Box>
  )
}

function Market(props: HeroRealmsTableViewProps) {

  const classes = useStyles();
  let index = 0;

  const buyCard = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_BUY_MARKET_CARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Box className={classes.market} mx={3}>
      {props.table.market.map(marketCard => {
        index++;
        const id = (marketCard === null ? "empty" + index : marketCard.id);
        const name = (marketCard === null ? "empty market " + index : marketCard.name);
        const image = (marketCard === null ? props.table.emptyDeck : marketCard.image);
        const disabled = (marketCard === null ? true : !props.table.ownPlayerArea.active);

        return (
          <Card key={"marketCard"+id} alt={name} image={image}
              onClick={() => {buyCard(id)}} disabled={disabled}/>
        )})
      }
    </Box>
  )
}

export default CommonArea
