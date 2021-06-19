import React, { Fragment, useEffect, useState } from 'react'
import { Fab, Box, makeStyles, Dialog, DialogTitle, DialogContent, Typography, Button, IconButton, DialogActions } from '@material-ui/core';
import { Delete, ExitToApp, NavigateBefore, NavigateNext } from '@material-ui/icons';
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
  HERO_REALMS_PUT_CHAMPION_DISCARD_INTO_PLAY_ENDPOINT,
  HERO_REALMS_RANGER_TRACK_DISCARD_ENDPOINT,
  HERO_REALMS_RANGER_TRACK_UP_ENDPOINT,
  HERO_REALMS_RANGER_TRACK_DOWN_ENDPOINT,
  HERO_REALMS_RANGER_TRACK_END_ENDPOINT,
  HERO_REALMS_ACQUIRE_OPPONENT_DISCARD_ENDPOINT,
  HERO_REALMS_SELECT_PLAYER_FOR_FIREBALL_ENDPOINT,
  HERO_REALMS_CANCEL_SPECIAL_ACTION_MODE_ENDPOINT,
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
  rangerTrackCardContainer: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  rangerTrackCard: {
    display: "flex",
    justifyContent: "center",
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
        <SelectPlay4BlessOrFireballDialog {...props} bless/>
      }
      {area.actionMode === SpecialActionMode.PUT_CHAMPION_DISCARD_INTO_PLAY && 
        <PutChampionDiscardIntoPlayDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.RANGER_TRACK && 
        <RangerTrackDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.ACQUIRE_OPPONENT_DISCARD && 
        <AcquireOpponentDiscardDialog {...props}/>
      }
      {area.actionMode === SpecialActionMode.WIZARD_FIREBALL && 
        <SelectPlay4BlessOrFireballDialog {...props} fireball/>
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

const endSpecialActionMode = async (id: string) => {
  await api.post(HERO_REALMS_ENDPOINT + "/" + id + HERO_REALMS_CANCEL_SPECIAL_ACTION_MODE_ENDPOINT)
      .then()
      .catch(error => {});
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
          {props.table.otherPlayerAreas.filter(otherArea => otherArea.handSize > 0)
              .map(otherArea => {
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
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {endSpecialActionMode(props.id)}}>
          Abbrechen
        </Button>
      </DialogActions>
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
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {endSpecialActionMode(props.id)}}>
          Abbrechen
        </Button>
      </DialogActions>
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
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {endSpecialActionMode(props.id)}}>
          Abbrechen
        </Button>
      </DialogActions>
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
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {endSpecialActionMode(props.id)}}>
          Abbrechen
        </Button>
      </DialogActions>
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
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {endSpecialActionMode(props.id)}}>
          Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export interface SelectPlay4BlessOrFireballDialogProps {
  id: string;
  table: HeroRealmsTableView;
  area: PlayerArea;
  bless?: boolean;
  fireball?: boolean;
}

export function SelectPlay4BlessOrFireballDialog(props: SelectPlay4BlessOrFireballDialogProps) {
  
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

  const selectPlayer4Fireball = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_SELECT_PLAYER_FOR_FIREBALL_ENDPOINT, {playerId: id})
        .then()
        .catch(error => {});
  }

  const onClick = props.bless ? selectPlayer4Bless : (props.fireball ? selectPlayer4Fireball : (() => {}))
  const areas = props.bless ? allAreas : (props.fireball ? props.table.otherPlayerAreas : null)

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        {props.bless && 
          <div>Wähle einen Spieler um ihn zu segnen</div>
        }
        {props.fireball && 
          <div>Wähle einen Spieler als Ziel</div>
        }
      </DialogTitle>
      <DialogContent>
        <Box className={classes.selectBlessContainer}>
          {areas?.filter(area => !area.killed)
              .map(area => {
            return (
              <Box>
                  <Button variant="contained" color="primary"
                      onClick={() => {onClick(area.playerId)}} disabled={selected}>
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
      {props.bless &&
        <DialogActions>
          <Button variant="text" color="primary" onClick={() => {endSpecialActionMode(props.id)}}>
            Abbrechen
          </Button>
        </DialogActions>
      }
    </Dialog>
  )
}

export function PutChampionDiscardIntoPlayDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const putChampionIntoPlay = async (id: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_PUT_CHAMPION_DISCARD_INTO_PLAY_ENDPOINT, {cardId: id})
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
          {props.area.discardPile.cards.filter(champion => champion.stunnedSinceLastTurn)
            .map(champion => {
              return (
                <Card key={"championCard"+champion.id} alt={champion.name} image={champion.image}
                    onClick={() => {putChampionIntoPlay(champion.id)}} disabled={selected} ready/>
              )})
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export function RangerTrackDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const area = props.area;
  const rangerTrackCards = area.rangerTrackCards;
  const cardCount = rangerTrackCards.length;
  
  const rangerTrackDiscard = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_RANGER_TRACK_DISCARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }
  
  const rangerTrackUp = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_RANGER_TRACK_UP_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }
  
  const rangerTrackDown = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_RANGER_TRACK_DOWN_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }
  
  const rangerTrackEnd = async () => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_RANGER_TRACK_END_ENDPOINT)
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle max. 2 Karten zum abwerfen und sortiere den Rest
      </DialogTitle>
      <DialogContent>
        <Box className={classes.selectCardDialog}>
          {rangerTrackCards.map(card => {
              const index = rangerTrackCards.indexOf(card);
              return (
                <Box className={classes.rangerTrackCardContainer}>
                  <Box className={classes.rangerTrackCard}>
                    <Card key={"trackCard"+card.id} alt={card.name} image={card.image}
                        onClick={() => {}} disabled={true} ready/>
                  </Box>
                  <Box>
                    {index > 0 &&
                      <IconButton onClick={() => {rangerTrackUp(card.id)}}>
                        <NavigateBefore/>
                      </IconButton>
                    }
                    <IconButton onClick={() => {rangerTrackDiscard(card.id)}} disabled={area.rangerTrackDiscardCount === 0}>
                      <Delete/>
                    </IconButton>
                    {index < (cardCount-1) &&
                      <IconButton onClick={() => {rangerTrackDown(card.id)}}>
                        <NavigateNext/>
                      </IconButton>
                    }
                  </Box>
                </Box>
              )})
          }
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {rangerTrackEnd()}}>
          Weiter
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function AcquireOpponentDiscardDialog(props: OwnAreaProps) {
  
  const classes = useStyles();
  const [selected, setSelected] = useState<boolean>(false);

  const acquireOpponentCard = async (playerId: string, cardId: string) => {
    setSelected(true);
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_ACQUIRE_OPPONENT_DISCARD_ENDPOINT, 
          {playerId: playerId, cardId: cardId})
        .then()
        .catch(error => {});
  }

  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        Wähle eine Karte die du kaufen möchtest.
      </DialogTitle>
      <DialogContent>
        <Box className={classes.stunChampionPlayerBox}>
          {props.table.otherPlayerAreas.map(otherArea => {
            return (
              <Fragment>
                <Typography variant="subtitle1">{otherArea.playerName}</Typography>
                <Box className={classes.stunChampionChampionsBox}>
                  {otherArea.discardPile.cards
                      .filter(card => card.cost > 0 && card.cost <= props.area.gold)
                      .map(card => {
                    return (
                      <Card key={"discardCard"+card.id} alt={card.name} image={card.image}
                          onClick={() => {acquireOpponentCard(otherArea.playerId, card.id)}} disabled={selected} ready/>
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

export interface EndTurnButtonProps {
  id: string;
  area: PlayerArea;
}

function EndTurnButton(props: EndTurnButtonProps) {

  const classes = useStyles();

  const [ endTurnButtonAvailable, setEndTurnButtonAvailable ] = useState<boolean>(false);

  const openActions = ((props.area.combat + props.area.gold) > 0 || props.area.decisions.length > 0);

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
        <Fab variant="extended" color={openActions ? "default" : "primary"} className={classes.endTurnButton} onClick={() => endTurn()}>
          <ExitToApp className={classes.endTurnButtonIcon}/>
          {openActions ? "" : "Zug beenden"}
        </Fab>
      }
    </Fragment>
  )
}

export default OwnArea
