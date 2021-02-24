import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Grid, Button, makeStyles, Avatar } from '@material-ui/core';
import { firestore, COLLECTION_GAMES, COLLECTION_TABLE } from '../../common/firebase/Firebase'
import { getAuth } from '../../common/auth/authSlice'
import { HeroRealmsTableView } from './HeroRealmsTypes'

interface HeroRealmsTableProps {
    id: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  image: {
    width: "200px",
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    right: "30px",
    top: "30px",
  },
  area: {
    border: '1px solid',
    borderColor: theme.palette.primary.light,
  },
}));

function HeroRealmsTable(props: HeroRealmsTableProps) {

  const classes = useStyles();
  const userId = useSelector(getAuth)?.uid;
  const [userTableView] = useDocument(
    firestore.collection(COLLECTION_GAMES).doc(props.id).collection(COLLECTION_TABLE).doc(userId?userId:"x")
  );
  const [ table, setTable ] = useState<HeroRealmsTableView>();
  
  useEffect(() => {
    if (userTableView) {
      setTable(userTableView.data());
    }
  }, [userTableView])

  const isActivePlayer = table?.ownPlayerArea.active;
  const marketDeckSize = (table?.marketDeck) ? table.marketDeck.size : 0;
  const ownDeckSize = (table?.ownPlayerArea.deck) ? table.ownPlayerArea.deck.size : 0;
  const ownDiscardSize = (table?.ownPlayerArea.discardPile) ? table.ownPlayerArea.discardPile.size : 0;

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item container xs={12}>
          {table?.otherPlayerAreas.map(area => {
            return (
              <Grid item container xs className={classes.area}>
                {area.playerName}
              </Grid>
            )})
          }
        </Grid>
        <Grid item container xs={12} wrap="nowrap" className={classes.area}>
          <Grid item xs>
            <Button onClick={() => {}} key="fireGemDeckButton" disabled={!isActivePlayer}>
              <img src={"..//"+table?.fireGemsDeck.cards[0].image} alt="fire_gem" className={classes.image}/>
            </Button>
          </Grid>

          {table?.market.map(marketCard => {
            return (
              <Grid item xs>
                <Button onClick={() => {}} key={"marketButton"+table?.market.indexOf(marketCard)} disabled={!isActivePlayer}>
                  <img src={"..//"+marketCard.image} alt={marketCard.name} 
                    key={"MarketCard"+table?.market.indexOf(marketCard)} 
                    className={classes.image}/>
                </Button>
              </Grid>
            )})
          }

          <Grid item>
            <Button onClick={() => {}} key="marketDeckButton" disabled>
              <Avatar className={classes.avatar}>{marketDeckSize}</Avatar>
              <img src={"..//"+((marketDeckSize > 0) ? table?.cardBack : table?.emptyDeck)} alt="market deck" className={classes.image}/>
            </Button>
          </Grid>
        </Grid>
        <Grid item container xs={12} className={classes.area}>

          {table?.ownPlayerArea.hand.map(handCard => {
            return (
              <Grid item xs>
                <Button onClick={() => {}} key={"handButton"+table?.ownPlayerArea.hand.indexOf(handCard)} disabled={!isActivePlayer}>
                  <img src={"..//"+handCard.image} alt={handCard.name} 
                    key={"HandCard"+table?.ownPlayerArea.hand.indexOf(handCard)} 
                    className={classes.image}/>
                </Button>
              </Grid>
            )})
          }

          <Grid item xs>
            <Button onClick={() => {}} key="deckButton" disabled>
              <Avatar className={classes.avatar}>{ownDeckSize}</Avatar>
              <img src={"..//"+((ownDeckSize > 0) ? table?.cardBack : table?.emptyDeck)} alt="deck" className={classes.image}/>
            </Button>
          </Grid>

          <Grid item>
            <Button onClick={() => {}} key="discardPileButton" disabled>
              <Avatar className={classes.avatar}>{ownDiscardSize}</Avatar>
              <img src={"..//"+((ownDiscardSize > 0) ? table?.cardBack : table?.emptyDeck)} alt="discard pile" className={classes.image}/>
            </Button>
          </Grid>
          
        </Grid>
      </Grid>

      {userTableView && <pre>{JSON.stringify(userTableView.data(), null, 2)}</pre>}
    </div>
  )
}

export default HeroRealmsTable
