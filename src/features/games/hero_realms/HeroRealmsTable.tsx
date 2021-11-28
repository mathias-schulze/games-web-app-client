import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useDocument, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Button, Avatar, Popover, Paper, Box, makeStyles, Dialog, DialogTitle, DialogContent, Typography, IconButton, DialogActions } from '@material-ui/core';
import { firestore, COLLECTION_GAMES, COLLECTION_TABLE } from '../../common/firebase/Firebase'
import { getAuth } from '../../common/auth/authSlice'
import { Stage } from '../../common/Const';
import { HeroRealmsTableView, PlayerArea } from './HeroRealmsTypes'
import OtherArea from './OtherArea';
import CommonArea from './CommonArea';
import OwnArea from './OwnArea';
import PlayedCards from './PlayedCards';
import { green, yellow, red, blue } from '@material-ui/core/colors';
import { DeleteForever } from '@material-ui/icons';
import api, { 
  HERO_REALMS_ENDPOINT,
  HERO_REALMS_CHARACTER_ROUND_ABILITIES_ENDPOINT,
  HERO_REALMS_CHARACTER_ONE_TIME_ABILITIES_ENDPOINT
} from '../../common/api/api';
import { showDiscardPile, hideDiscardPileDialog, getShowDiscardPilePlayerId } from './heroRealmsSlice';
import { Game } from '../../common/game/GameTypes';

export const playerColors = [blue[100], green[100], red[100], yellow[100]];

export const useStyles = makeStyles(theme => ({
  table: {
    display: "flex",
    flexGrow: 1,
    flexFlow: "column wrap",
    width: "100%",
  },
  otherAreas: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  image: {
    width: "90px",
  },
  imageLarge: {
    width: "250px",
  },
  sacrificeIcon: {
    fontSize: "1.2em",
    color: "black",
  },
  sacrificeIconContainer: {
    backgroundColor: "grey",
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  notReady: {
    opacity: 0.6,
  },
  deckCount: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    right: "18px",
    top: "18px",
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: 11,
  },
  deckCountLeft: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
    position: "absolute",
    left: "18px",
    top: "18px",
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: 11,
  },
  popover: {
    pointerEvents: 'none',
  },
  finishedContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  backdrop: {
    position: 'absolute',
  },
  playDecksAndCardsBox: {
    display: "flex",
  },
  discardPileDialog: {
    display: "flex",
    justifyContent: "center",
  },
}));

export interface HeroRealmsTableProps {
    id: string;
    stage: Stage;
    winner: string | undefined;
}

function HeroRealmsTable(props: HeroRealmsTableProps) {

  const classes = useStyles();
  const userId = useSelector(getAuth)?.uid;
  const [game] = useDocumentDataOnce<Game>(
    firestore.collection(COLLECTION_GAMES).doc(props.id)
  );
  const [isObserver, setIsObserver] = useState(true);
  const [userTableView] = useDocument(
    firestore.collection(COLLECTION_GAMES).doc(props.id).collection(COLLECTION_TABLE).doc(!userId || isObserver ? "observer" : userId)
  );
  const [ table, setTable ] = useState<HeroRealmsTableView>();

  useEffect(() => {
    if (game) {
      setIsObserver(game.players.filter(player => player === userId).length === 0);
    }
  }, [game, userId])

  useEffect(() => {
    if (userTableView) {
      setTable(userTableView.data());
    }
  }, [userTableView])

  const getJustifyContent = (table: HeroRealmsTableView, area: PlayerArea) => {
    
    const index = table.otherPlayerAreas.indexOf(area);
    const size = table.otherPlayerAreas.length;
    return (index === 0 ? "flex-start" : (index === size-1 ? "flex-end" : "center"));
  }

  return (
    <div>
      {table &&
        <Box className={classes.table}>
          <Box className={classes.otherAreas}>
            {table.otherPlayerAreas.map(area => {
              return <OtherArea id={props.id} table={table} area={area} observer={isObserver} key={"area"+area.playerId}
                  justifyContent={getJustifyContent(table, area)} availableCombat={table.ownPlayerArea.combat}/> })
            }
          </Box>
          {table.otherPlayerAreas.filter(area => area.active)
              .map(area => {
                return <PlayedCards key={"playedCards"+area.playerId}
                    id={props.id} area={area} justifyContent={getJustifyContent(table, area)}/> })
              }
          <CommonArea id={props.id} table={table} observer={isObserver}/>
          <OwnArea id={props.id} area={table.ownPlayerArea} table={table} observer={isObserver}/>
          
          {props.stage === Stage.FINISHED && <GameFinishedDialog game={props} table={table}/>}
        </Box>
      }
    </div>
  )
}

export interface GameFinishedDialogProps {
  game: HeroRealmsTableProps;
  table: HeroRealmsTableView;
}

function GameFinishedDialog(props: GameFinishedDialogProps) {

  const classes = useStyles();

  let winner = props.game.winner && props.table.players.filter(player => player.id === props.game.winner)[0].name;

  return (
    <Box className={classes.finishedContainer}>
      <Dialog open={true} disablePortal
          style={{ position: "absolute" }}
          BackdropProps={{ classes: { root: classes.backdrop } }}>
        <DialogTitle>Spiel beendet</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">Sieger:</Typography>
          <Typography variant="h6" align="center">{winner}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export interface DeckProps {
  alt: string;
  count: number;
  counterLeft?: boolean;
  image: string;
  emptyImage: string;
  disabled: boolean;
  onClick: React.MouseEventHandler;
}

export function Deck(props: DeckProps) {

  const classes = useStyles();

  return (
    <Button onClick={props.onClick} disabled={props.disabled}>
      <Avatar className={props.counterLeft ? classes.deckCountLeft : classes.deckCount}>{props.count}</Avatar>
      <img src={"..//"+((props.count > 0) ? props.image : props.emptyImage)} alt={props.alt} className={classes.image}/>
    </Button>
  )
}

export interface CardProps {
  alt: string;
  image: string;
  disabled: boolean;
  ready: boolean;
  sacrifice?: boolean;
  onClick: React.MouseEventHandler;
}

export function Card(props: CardProps) {

  const classes = useStyles();
  
  const imageClassName = props.ready ? "" : classes.notReady;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  return (
    <Fragment>
      <Paper square aria-owns={popoverOpen ? 'mouse-over-popover' : undefined} aria-haspopup="true"
          onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}
          className={imageClassName} style={{backgroundColor: "inherit"}}>
        <Button onClick={props.onClick} disabled={props.disabled}>
          {props.sacrifice &&
            <IconButton className={classes.sacrificeIconContainer}>
              <DeleteForever className={classes.sacrificeIcon}/>
            </IconButton>
          }
          <img src={"..//"+props.image} alt={props.alt} className={classes.image}/>
        </Button>
      </Paper>
      <Popover id="mouse-over-popover" className={classes.popover}
          open={popoverOpen} anchorEl={anchorEl} disableRestoreFocus
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <img src={"..//"+props.image} alt={props.alt} className={classes.imageLarge}/>
      </Popover>
    </Fragment>
  )
}

export interface PlayerDecksAndCardsProps {
  id: string;
  table: HeroRealmsTableView;
  area: PlayerArea;
  own?: boolean;
  observer: boolean;
}

export function PlayerDecksAndCards(props: PlayerDecksAndCardsProps) {

  const classes = useStyles();
  const dispatch = useDispatch();
  
  const table = props.table;
  const area = props.area;
  const discardPileImage = ((area.discardPile.size === 0) ? table.emptyDeck : (area.discardPile.cards[area.discardPile.size-1].image));
  const showDiscardPilePlayerId = useSelector(getShowDiscardPilePlayerId);
  const roundAbilityReady = area.characterRoundAbilityActive != null && area.characterRoundAbilityActive;
  const roundAbilityDisabled = props.observer || !area.active || !props.own || !roundAbilityReady;
  const oneTimeAbilityDisabled = props.observer || !area.active || !props.own;

  const processCharacterRoundAbilities = async () => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_CHARACTER_ROUND_ABILITIES_ENDPOINT)
        .then()
        .catch(error => {});
  }

  const processCharacterOneTimeAbilities = async () => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_CHARACTER_ONE_TIME_ABILITIES_ENDPOINT)
        .then()
        .catch(error => {});
  }

  return (
    <Box className={classes.playDecksAndCardsBox}>
      <Deck alt="deck" count={area.deck.size} 
          image={table.cardBack} emptyImage={table.emptyDeck}
          onClick={() => {}} disabled={true}/>

      <Deck alt="discard pile" count={area.discardPile.size} 
          image={discardPileImage} emptyImage={table.emptyDeck}
          onClick={() => {dispatch(showDiscardPile(area.playerId))}} disabled={false}/>
      {area.characterRoundAbilityImage &&
        <Card key={"roundAbility"} alt="round ability" image={area.characterRoundAbilityImage}
                  onClick={() => {processCharacterRoundAbilities()}} disabled={roundAbilityDisabled} ready={roundAbilityReady}/>
      }
      {area.characterOneTimeAbilityImage &&
        <Card key={"oneTimeAbility"} alt="one time ability" image={area.characterOneTimeAbilityImage}
                  onClick={() => {processCharacterOneTimeAbilities()}} disabled={oneTimeAbilityDisabled} ready/>
      }

      {showDiscardPilePlayerId === area.playerId &&
        <ShowDiscardPileDialog {...props}/>
      }
    </Box>
  )
}

function ShowDiscardPileDialog(props: PlayerDecksAndCardsProps) {
  
  const classes = useStyles();
  const dispatch = useDispatch();

  const area = props.area;
  
  return (
    <Dialog open={true} maxWidth="lg" onClose={() => {}}>
      <DialogTitle>
        {area.playerName}
      </DialogTitle>
      <DialogContent>
        <Box className={classes.discardPileDialog}>
          {props.area.discardPile.cards.map(card => {
              return (
                <Card key={"discardCard"+card.id} alt={card.name} image={card.image}
                    onClick={() => {}} disabled ready/>
              )})
          }
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={() => {dispatch(hideDiscardPileDialog())}}>
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default HeroRealmsTable
