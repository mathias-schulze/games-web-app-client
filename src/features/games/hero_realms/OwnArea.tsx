import React, { Fragment, useState } from 'react'
import { Grid, Fab, Box } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_END_TURN_ENDPOINT } from '../../common/api/api';
import { useStyles } from './HeroRealmsTableStyles'
import HealthGoldCombatIndicator from './HealthGoldCombatIndicator';
import { Card, Deck } from './HeroRealmsTable';
import { PlayerArea } from './HeroRealmsTypes';

export interface OwnAreaProps {
  id: string;
  area: PlayerArea;
  back: string;
  empty: string;
}

function OwnArea(props: OwnAreaProps) {

  const classes = useStyles();

  const area = props.area;

  return (
    <Fragment>
        <Grid item container xs={12} className={classes.area}>
          <Box display="flex" flexGrow={1}>
            <Box justifyContent="flex-start" flexGrow={1}/>
          </Box>
          <HealthGoldCombatIndicator activePlayer={area.active} 
              health={area.health} 
              gold={area.gold} 
              combat={area.combat}/>
        </Grid>
        <Grid item container xs={12} className={classes.area}>

          {area.hand.map(handCard => {
            return (
              <Grid item xs>
                <Card key={"handCard"+area.hand.indexOf(handCard)} alt={handCard.name} image={handCard.image}
                    onClick={() => {}} disabled={!area.active}/>
              </Grid>
            )})
          }

          <Grid item xs>
            <Deck key="ownDeck" alt="own deck" count={area.deck.size} 
                image={props.back} emptyImage={props.empty}
                onClick={() => {}} disabled={true}/>
          </Grid>

          <Grid item>
            <Deck key="discardPile" alt="discard pile" count={area.discardPile.size} 
                image={props.back} emptyImage={props.empty}
                onClick={() => {}} disabled={true}/>
          </Grid>
      </Grid>
      
      <EndTurnButton id={props.id} area={area}/>
    </Fragment>
  )
}

export interface EndTurnButtonProps {
  id: string;
  area: PlayerArea;
}

function EndTurnButton(props: EndTurnButtonProps) {

  const classes = useStyles();

  const [ endTurnButtonAvailable, setEndTurnButtonAvailable ] = useState<boolean>(props.area.active);

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
