import React, { Fragment, useEffect, useState } from 'react'
import { Fab, Box, makeStyles, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import api, { 
  HERO_REALMS_ENDPOINT,
  HERO_REALMS_END_TURN_ENDPOINT,
  HERO_REALMS_PLAY_CARD_ENDPOINT,
  HERO_REALMS_DISCARD_CARD_ENDPOINT,
  HERO_REALMS_SACRIFICE_CARD_ENDPOINT
} from '../../common/api/api';
import HealthGoldCombatIndicator from './HealthGoldCombatIndicator';
import { Card, PlayerDeckAndDiscard, playerColors } from './HeroRealmsTable';
import { HeroRealmsTableView, PlayerArea, SpecialActionMode } from './HeroRealmsTypes';
import PlayedCards from './PlayedCards';
import PlayedChampions from './PlayedChampions';

export const useStyles = makeStyles(theme => ({
  ownArea: {
    display: "flex",
    flexGrow: 1,
    flexFlow: "column wrap",
    width: "100%",
  },
  cards: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  hand: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
  },
  selectCardDialog: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  endTurnButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  endTurnButtonIcon: {
    marginRight: theme.spacing(1),
  },
}));

export interface OwnAreaProps {
  id: string;
  table: HeroRealmsTableView;
  area: PlayerArea;
}

function OwnArea(props: OwnAreaProps) {

  const classes = useStyles();

  const area = props.area;

  const playCard = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_PLAY_CARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Box className={classes.ownArea} style={{backgroundColor: playerColors[area.position]}}>
      <HealthGoldCombatIndicator id={props.id} area={area}/>
      {area.active && 
        <PlayedCards id={props.id} area={area} own justifyContent="center"/>
      }
      {area.actionMode === SpecialActionMode.DISCARD && 
        <DiscardCardDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.SACRIFICE && 
        <SacrificeHandOrDiscardDialog {...props}/>
      }
      <Box className={classes.cards}>
        <PlayedChampions id={props.id} area={area} justifyContent="flex-start" own/>
        <Box className={classes.hand}>
          {area.hand.map(handCard => {
            return (
              <Card key={"handCard"+handCard.id} alt={handCard.name} image={handCard.image}
                  onClick={() => {playCard(handCard.id)}} disabled={!area.active} ready/>
            )})
          }
        </Box>
        <PlayerDeckAndDiscard table={props.table} area={area}/>
      </Box>
      <EndTurnButton id={props.id} area={area}/>
    </Box>
  )
}

export function DiscardCardDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const discardCard = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_DISCARD_CARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle eine Karte zum abwerfen
      </DialogTitle>
      <DialogContent>
        <Box className={classes.hand}>
          {props.area.hand.map(handCard => {
            return (
              <Card key={"handCard"+handCard.id} alt={handCard.name} image={handCard.image}
                  onClick={() => {discardCard(handCard.id)}} disabled={selected} ready/>
            )})
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function SacrificeHandOrDiscardDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const sacrificeCard = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_SACRIFICE_CARD_ENDPOINT, 
          {cardId: id, withAbility: false})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle eine Karte zum opfern
      </DialogTitle>
      <DialogContent>
        <Box className={classes.selectCardDialog}>
          {props.area.hand.concat(props.area.discardPile.cards).map(card => {
            return (
              <Card key={"sacrificeCard"+card.id} alt={card.name} image={card.image}
                  onClick={() => {sacrificeCard(card.id)}} disabled={selected} ready/>
            )})
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export interface EndTurnButtonProps {
  id: string;
  area: PlayerArea;
}

function EndTurnButton(props: EndTurnButtonProps) {

  const classes = useStyles();

  const [ endTurnButtonAvailable, setEndTurnButtonAvailable ] = useState<boolean>(false);

  useEffect(() => {
    setEndTurnButtonAvailable(props.area.active);
  }, [props.area.active])

  const endTurn = async () => {

    setEndTurnButtonAvailable(false);

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_END_TURN_ENDPOINT)
        .then()
        .catch(error => {});
  }

  return (
    <Fragment>
      {endTurnButtonAvailable &&
        <Fab variant="extended" color="primary" className={classes.endTurnButton} onClick={() => endTurn()}>
          <ExitToApp className={classes.endTurnButtonIcon}/>
          Zug beenden
        </Fab>
      }
    </Fragment>
  )
}

export default OwnArea
