import React from 'react'
import { Box, Button, ButtonGroup, makeStyles, Paper } from '@material-ui/core';
import { DecisionType, PlayerArea } from './HeroRealmsTypes'
import { Card, playerColors } from './HeroRealmsTable';
import api, { HERO_REALMS_ENDPOINT, HERO_REALMS_SACRIFICE_CARD_ENDPOINT, HERO_REALMS_MAKE_DECISION_ENDPOINT } from '../../common/api/api';

export const useStyles = makeStyles(theme => ({
  playedCards: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
  },
  emptyCard: {
    height: "166px",
  },
  decisionBox: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
  decisionButton: {
    marginBottom: theme.spacing(0.5),
    textTransform: "none",
  },
}));

export interface PlayedCardsProps {
  id: string;
  area: PlayerArea;
  own?: boolean;
  justifyContent: string;
}

function PlayedCards(props: PlayedCardsProps) {

  const classes = useStyles();

  const sacrificeCard = async (id: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_SACRIFICE_CARD_ENDPOINT, {cardId: id})
        .then()
        .catch(error => {});
  }

  const makeDecision = async (decisionId: string, optionId?: string) => {
    await api.post(HERO_REALMS_ENDPOINT + "/" + props.id + HERO_REALMS_MAKE_DECISION_ENDPOINT, 
          {decisionId: decisionId, optionId: optionId})
        .then()
        .catch(error => {});
  }

  return (
    <Box className={classes.playedCards} justifyContent={props.justifyContent}
        style={{backgroundColor: playerColors[props.area.position]}}>
      {props.area.playedCards.length === 0 &&
        <Paper className={classes.emptyCard}/>
      }
      {props.area.playedCards.map(card => {
        const sacrifice = (props.own && card.sacrifice);
        return (
          <Card key={"playedCard"+card.id} alt={card.name} image={card.image}
              onClick={() => {sacrificeCard(card.id)}} disabled={!sacrifice} ready sacrifice={sacrifice}/>
        )})
      }
      {props.area.decisions.length > 0 &&
        <Box className={classes.decisionBox}>
          {props.area.decisions.map(decision => {
            if (decision.type === DecisionType.SELECT_ONE) {
              return (
                <ButtonGroup>
                  {decision.options.map(option => {
                    return <Button key={option.id} className={classes.decisionButton}
                        onClick={() => {makeDecision(decision.id, option.id)}} disabled={!props.own}>
                      {option.text}
                    </Button>
                  })}
                </ButtonGroup>
              )
            } else {
              return (
                <Button key={decision.id} className={classes.decisionButton} variant="outlined"
                    onClick={() => {makeDecision(decision.id)}} disabled={!props.own}>
                  {decision.text}
                </Button>
              )
            }
          })}
        </Box>
      }
    </Box>
  )
}

export default PlayedCards
