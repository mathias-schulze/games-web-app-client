import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Grid, Button, Avatar, Popover, Paper } from '@material-ui/core';
import { firestore, COLLECTION_GAMES, COLLECTION_TABLE } from '../../common/firebase/Firebase'
import { getAuth } from '../../common/auth/authSlice'
import { HeroRealmsTableView } from './HeroRealmsTypes'
import { useStyles } from './HeroRealmsTableStyles'
import OtherArea from './OtherArea';
import CommonArea from './CommonArea';
import OwnArea from './OwnArea';
import PlayedCards from './PlayedCards';

export interface HeroRealmsTableProps {
    id: string;
}

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

  return (
    <div>
      {table &&
        <Grid container className={classes.root}>
          <Grid item container xs={12}>
            {table.otherPlayerAreas.map(area => {
              return <OtherArea id={props.id} area={area} key={"area"+area.playerId}
                  availableCombat={table.ownPlayerArea.combat}/> })
            }
          </Grid>
          {table.otherPlayerAreas.filter(area => area.active)
              .map(area => { return <PlayedCards id={props.id} area={area}/> })}
          <CommonArea id={props.id} table={table}/>
          <OwnArea id={props.id} area={table.ownPlayerArea} back={table.cardBack} empty={table.emptyDeck}/>
        </Grid>
      }

      {userTableView && <pre>{JSON.stringify(userTableView.data(), null, 2)}</pre>}
    </div>
  )
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
  onClick: React.MouseEventHandler;
}

export function Card(props: CardProps) {

  const classes = useStyles();
  
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
          onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <Button onClick={props.onClick} disabled={props.disabled}>
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

export default HeroRealmsTable
