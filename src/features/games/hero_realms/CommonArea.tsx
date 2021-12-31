import React from 'react'
import { Avatar, Box, makeStyles } from '@material-ui/core';
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_BUY_MARKET_CARD_ENDPOINT, HERO_REALMS_BUY_FIRE_GEM_ENDPOINT } from '../../common/api/api';
import { HeroRealmsTableViewProps } from './HeroRealmsTypes'
import { Card, Deck } from './HeroRealmsTable';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  commonAreaBox: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing(1.5),
  },
  commonArea: {
    width: "100%",
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
  },
  roundCounterBox: {
    display: "flex",
    flexGrow: 1,
    alignItems: 'center',
  },
  roundCounter: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    width: 65,
    height: 65,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: grey[600],
  },
  market: {
    display: "flex",
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
}));

function CommonArea(props: HeroRealmsTableViewProps) {

  const classes = useStyles();

  const table = props.table;
  const fireGemsCount = table.fireGemsDeck.size;
  const fireGemsImage = (fireGemsCount > 0) ? table.fireGemsDeck.cards[0].image : "";
  const sacrficePileImage = ((table.sacrificePile.size === 0) ? "" : (table.sacrificePile.cards[table.sacrificePile.size-1].image));

  const buyFireGem = async () => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_BUY_FIRE_GEM_ENDPOINT)
        .then()
        .catch(error => {});
  }

  return (
    <Box className={classes.commonAreaBox} style={{backgroundColor: grey[400]}}>
      <RoundCounter {...props}/>
      <Box className={classes.commonArea} style={{backgroundColor: grey[400]}}>
        <Deck key="fireGemsDeck" alt="fire gems deck" count={fireGemsCount} counterLeft
            image={fireGemsImage} emptyImage={table.emptyDeck}
            onClick={() => {buyFireGem()}} disabled={props.observer || !table.ownPlayerArea.active}/>
        <Market {...props}/>
        <Deck key="marketDeck" alt="market deck" count={table.marketDeck.size} 
            image={table.cardBack} emptyImage={table.emptyDeck}
            onClick={() => {}} disabled={true}/>
        <Deck key="sacrificePile" alt="sacrifice pile" count={table.sacrificePile.size} 
            image={sacrficePileImage} emptyImage={table.emptyDeck}
            onClick={() => {}} disabled={true}/>
      </Box>
    </Box>
  )
}

function RoundCounter(props: HeroRealmsTableViewProps) {

  const classes = useStyles();

  return (
    <Box className={classes.roundCounterBox}>
      <Avatar className={classes.roundCounter}>
        # {props.table.round}
      </Avatar>
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
        const disabled = props.observer || (marketCard === null ? true : !props.table.ownPlayerArea.active);

        return (
          <Card key={"marketCard"+id} alt={name} image={image}
              onClick={() => {buyCard(id)}} disabled={disabled} ready/>
        )})
      }
    </Box>
  )
}

export default CommonArea
