import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Grid, Button, makeStyles, Avatar, Fab, Box, Typography } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { green, yellow, red } from '@material-ui/core/colors';
import { firestore, COLLECTION_GAMES, COLLECTION_TABLE } from '../../common/firebase/Firebase'
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_END_TURN_ENDPOINT } from '../../common/api/api';
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
  deckCount: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    right: "30px",
    top: "30px",
  },
  deckCountLeft: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    left: "30px",
    top: "30px",
  },
  area: {
    border: '1px solid',
    borderColor: theme.palette.primary.light,
  },
  endTurnButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  endTurnButtonIcon: {
    marginRight: theme.spacing(1),
  },
  health: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    color: 'black',
    backgroundColor: green[400],
  },
  gold: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    color: 'black',
    backgroundColor: yellow[600],
  },
  combat: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0),
    color: 'black',
    backgroundColor: red[400],
  },
}));

function HeroRealmsTable(props: HeroRealmsTableProps) {

  const classes = useStyles();
  const userId = useSelector(getAuth)?.uid;
  const [userTableView] = useDocument(
    firestore.collection(COLLECTION_GAMES).doc(props.id).collection(COLLECTION_TABLE).doc(userId?userId:"x")
  );
  const [ table, setTable ] = useState<HeroRealmsTableView>();
  const [ endTurnButtonAvailable, setEndTurnButtonAvailable ] = useState<boolean>(false);

  useEffect(() => {
    if (userTableView) {
      setTable(userTableView.data());
      setEndTurnButtonAvailable(userTableView.data().ownPlayerArea.active);
    }
  }, [userTableView])

  const isActivePlayer = table?.ownPlayerArea.active;
  const marketDeckSize = (table?.marketDeck) ? table.marketDeck.size : 0;
  const fireGemsDeckSize = (table?.fireGemsDeck) ? table.fireGemsDeck.size : 0;
  const ownDeckSize = (table?.ownPlayerArea.deck) ? table.ownPlayerArea.deck.size : 0;
  const ownDiscardSize = (table?.ownPlayerArea.discardPile) ? table.ownPlayerArea.discardPile.size : 0;


  const endTurn = async () => {

    setEndTurnButtonAvailable(false);

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_END_TURN_ENDPOINT)
        .then()
        .catch(error => {});
  }

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item container xs={12}>
          {table?.otherPlayerAreas.map(area => {
            return (
              <Grid item container xs className={classes.area}>
                <Box display="flex" flexGrow={1}>
                  <Box display="flex" justifyContent="flex-start" alignItems="center" flexGrow={1} margin={1}>
                    <Typography variant="h6">{area.playerName}</Typography>
                  </Box>
                </Box>
                <HealthGoldCombatIndicator activePlayer={area.active} health={area.health} gold={area.gold} combat={area.combat}/>
              </Grid>
            )})
          }
        </Grid>
        <Grid item container xs={12} wrap="nowrap" className={classes.area}>
          <Grid item xs>
            <Button onClick={() => {}} key="fireGemDeckButton" disabled={!isActivePlayer}>
              <Avatar className={classes.deckCountLeft}>{fireGemsDeckSize}</Avatar>
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
              <Avatar className={classes.deckCount}>{marketDeckSize}</Avatar>
              <img src={"..//"+((marketDeckSize > 0) ? table?.cardBack : table?.emptyDeck)} alt="market deck" className={classes.image}/>
            </Button>
          </Grid>
        </Grid>
        <Grid item container xs={12} className={classes.area}>
          <Box display="flex" flexGrow={1}>
            <Box justifyContent="flex-start" flexGrow={1}/>
          </Box>
          {table?.ownPlayerArea &&
            <HealthGoldCombatIndicator activePlayer={table?.ownPlayerArea.active} 
                health={table?.ownPlayerArea.health} 
                gold={table?.ownPlayerArea.gold} 
                combat={table?.ownPlayerArea.combat}/>
          }
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
              <Avatar className={classes.deckCount}>{ownDeckSize}</Avatar>
              <img src={"..//"+((ownDeckSize > 0) ? table?.cardBack : table?.emptyDeck)} alt="deck" className={classes.image}/>
            </Button>
          </Grid>

          <Grid item>
            <Button onClick={() => {}} key="discardPileButton" disabled>
              <Avatar className={classes.deckCount}>{ownDiscardSize}</Avatar>
              <img src={"..//"+((ownDiscardSize > 0) ? table?.cardBack : table?.emptyDeck)} alt="discard pile" className={classes.image}/>
            </Button>
          </Grid>
          
        </Grid>
      </Grid>
      
      {endTurnButtonAvailable &&
        <Fab variant="extended" color="primary" className={classes.endTurnButton} onClick={() => endTurn()}>
          <ExitToApp className={classes.endTurnButtonIcon}/>
          Zug beenden
        </Fab>
      }

      {userTableView && <pre>{JSON.stringify(userTableView.data(), null, 2)}</pre>}
    </div>
  )
}

interface HealthGoldCombatIndicatorProps {
    activePlayer: boolean;
    health: number;
    gold: number;
    combat: number;
}

function HealthGoldCombatIndicator(props: HealthGoldCombatIndicatorProps) {

  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="flex-end">
      <Avatar className={classes.health}>{props.health}</Avatar>
      {props.activePlayer &&
        <Fragment>
          <Avatar className={classes.gold}>{props.gold}</Avatar>
          <Avatar className={classes.combat}>{props.combat}</Avatar>
        </Fragment>
      }
    </Box>
  )
}

export default HeroRealmsTable
