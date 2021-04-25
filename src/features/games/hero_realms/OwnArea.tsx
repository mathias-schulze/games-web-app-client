import React, { Fragment, useEffect, useState } from 'react'
import { Fab, Box, makeStyles, Dialog, DialogTitle, DialogContent, Typography, Button } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import api, { 
  HERO_REALMS_ENDPOINT,
  HERO_REALMS_END_TURN_ENDPOINT,
  HERO_REALMS_PLAY_CARD_ENDPOINT,
  HERO_REALMS_DISCARD_CARD_ENDPOINT,
  HERO_REALMS_SELECT_PLAYER_FOR_DISCARD_CARD_ENDPOINT,
  HERO_REALMS_PREPARE_CHAMPION_ENDPOINT,
  HERO_REALMS_STUN_TARGET_CHAMPION_ENDPOINT,
  HERO_REALMS_PUT_CARD_TOP_DECK_ENDPOINT,
  HERO_REALMS_SACRIFICE_CARD_ENDPOINT,
  HERO_REALMS_SELECT_PLAYER_FOR_BLESS_ENDPOINT,
} from '../../common/api/api';
import HealthGoldCombatIndicator from './HealthGoldCombatIndicator';
import { Card, PlayerDecksAndCards, playerColors, Deck } from './HeroRealmsTable';
import { HeroRealmsTableView, PlayerArea, SpecialActionMode, CardType } from './HeroRealmsTypes';
import PlayedCards from './PlayedCards';
import PlayedChampions from './PlayedChampions';
import { red } from '@material-ui/core/colors';

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
  selectOpponentDeckContainer: {
    display: "flex",
    flexGrow: 1,
  },
  selectOpponentDeckBox: {
    flexGrow: 1,
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  selectOpponentDeckBoxSelected: {
    flexGrow: 1,
    textAlign: "center",
    background: red[200],
    flexDirection: "column",
    justifyContent: "center",
  },
  selectCardDialog: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  stunChampionPlayerBox: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  stunChampionChampionsBox: {
    display: "flex",
    justifyContent: "center",
  },
  selectBlessContainer: {
    flexGrow: 1,
    textAlign: "center",
    flexDirection: "column",
  },
  selectBlessChampionsContainer: {
    display: "flex",
    justifyContent: "center",
    height: "135px",
    marginBottom: theme.spacing(2),
  },
  endTurnButton: {
    position: 'fixed',
    bottom: theme.spacing(23),
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
      {area.actionMode === SpecialActionMode.OPPONENT_DISCARD_CARD && 
        <OpponentDiscardCardDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.PREPARE_CHAMPION && 
        <PrepareChampionDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.STUN_TARGET_CHAMPION && 
        <StunTargetChampionDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.PUT_CARD_DISCARD_PILE_TOP_DECK && 
        <PutCardTopDeckDialog {...props} onlyChampion={false}/>
      }
      {area.actionMode === SpecialActionMode.PUT_CHAMPION_DISCARD_PILE_TOP_DECK && 
        <PutCardTopDeckDialog {...props} onlyChampion/>
      }
      {area.actionMode === SpecialActionMode.SACRIFICE && 
        <SacrificeHandOrDiscardDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.CLERIC_BLESS && 
        <ClericBlessDialog {...props}/>
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
        <PlayerDecksAndCards {...props} own/>
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

export function OpponentDiscardCardDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(props.table.otherPlayerAreas.filter(area => area.selected4Discard).length > 0);

  const selectPlayer4DiscardCard = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_SELECT_PLAYER_FOR_DISCARD_CARD_ENDPOINT, {playerId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle den Spieler der eine Karte abwerfen muss
      </DialogTitle>
      <DialogContent>
        <Box className={classes.selectOpponentDeckContainer}>
          {props.table.otherPlayerAreas.map(otherArea => {
            const className = otherArea.selected4Discard ? classes.selectOpponentDeckBoxSelected : classes.selectOpponentDeckBox;
            return (
              <Box className={className}>
                  <Typography variant="h6">{otherArea.playerName}</Typography>
                  <Deck alt={otherArea.playerName + " deck"} count={otherArea.handSize} 
                    image={props.table.cardBack} emptyImage={props.table.emptyDeck}
                    onClick={() => {selectPlayer4DiscardCard(otherArea.playerId)}} disabled={selected}/>
              </Box>
          )})}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function PrepareChampionDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const prepareChampion = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_PREPARE_CHAMPION_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle einen Champion
      </DialogTitle>
      <DialogContent>
        <Box className={classes.hand}>
          {props.area.champions.filter(champion => !champion.ready)
            .map(champion => {
              return (
                <Card key={"championCard"+champion.id} alt={champion.name} image={champion.image}
                    onClick={() => {prepareChampion(champion.id)}} disabled={selected} ready/>
              )})
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function StunTargetChampionDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const stunTargetChampion = async (playerId: string, championId: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_STUN_TARGET_CHAMPION_ENDPOINT, 
          {playerId: playerId, championId: championId})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle einen Champion
      </DialogTitle>
      <DialogContent>
        <Box className={classes.stunChampionPlayerBox}>
          {props.table.otherPlayerAreas.map(area => {
            return (
              <Fragment>
                <Typography variant="subtitle1">{area.playerName}</Typography>
                <Box className={classes.stunChampionChampionsBox}>
                  {area.champions.map(champion => {
                    return (
                      <Card key={"championCard"+champion.id} alt={champion.name} image={champion.image}
                          onClick={() => {stunTargetChampion(area.playerId, champion.id)}} disabled={selected} ready/>
                    )})
                  }
                </Box>
              </Fragment>
            )
          })}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export interface PutCardTopDeckProps {
  id: string;
  table: HeroRealmsTableView;
  area: PlayerArea;
  onlyChampion: boolean;
}

export function PutCardTopDeckDialog(props: PutCardTopDeckProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const putCardTopDeck = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_PUT_CARD_TOP_DECK_ENDPOINT, 
          {cardId: id, withAbility: false})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle eine Karte um sie auf den Nachzugstapel zu legen
      </DialogTitle>
      <DialogContent>
        <Box className={classes.selectCardDialog}>
          {props.area.discardPile.cards
            .filter(card => !props.onlyChampion || card.type === CardType.CHAMPION || card.type === CardType.GUARD)
            .map(card => {
              return (
                <Card key={"discardCard"+card.id} alt={card.name} image={card.image}
                    onClick={() => {putCardTopDeck(card.id)}} disabled={selected} ready/>
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

export function ClericBlessDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);
  const allAreas = [...props.table.otherPlayerAreas];
  allAreas.push(props.area);

  const selectPlayer4Bless = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_SELECT_PLAYER_FOR_BLESS_ENDPOINT, {playerId: id})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle einen Spieler um ihn zu segnen
      </DialogTitle>
      <DialogContent>
        <Box className={classes.selectBlessContainer}>
          {allAreas.map(area => {
            return (
              <Box>
                  <Button variant="contained" color="primary"
                      onClick={() => {selectPlayer4Bless(area.playerId)}} disabled={selected}>
                    {area.playerName}
                  </Button>
                  <Box className={classes.selectBlessChampionsContainer}>
                    {area.champions.map(champion => {
                      return (
                        <Card key={"championCard"+champion.id} alt={champion.name} image={champion.image}
                            onClick={() => {}} disabled={true} ready/>
                      )})
                    }
                  </Box>
              </Box>
          )})}
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
