import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Box, Button, ButtonGroup, makeStyles, Paper } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { ExitToApp } from '@material-ui/icons';

import api, {
	HERO_REALMS_END_TURN_ENDPOINT,
	HERO_REALMS_ENDPOINT,
	HERO_REALMS_MAKE_DECISION_ENDPOINT,
	HERO_REALMS_SACRIFICE_CARD_ENDPOINT,
} from '../../common/api/api';
import { Card, playerColors } from './HeroRealmsTable';
import { DecisionType, PlayerArea } from './HeroRealmsTypes';

export const useStyles = makeStyles((theme) => ({
  playedCardsAreaBox: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
  },
  playedCardsAndDecsionsBox: {
    display: 'flex',
    flexGrow: 1,
  },
  playedCards: {
    display: 'flex',
    flexGrow: 1,
  },
  emptyCard: {
    height: '135px',
  },
  decisionBox: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  decisionButton: {
    marginBottom: theme.spacing(0.5),
    textTransform: 'none',
  },
  decisionButtonActive: {
    fontWeight: 'bold',
    color: green[700],
  },
  endTurnButtonBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  endTurnButtonSpace: {
    flexGrow: 1,
  },
  endTurnButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: '20px',
  },
  endTurnButtonIcon: {
    marginRight: theme.spacing(1),
  },
}));

export interface PlayedCardsProps {
  id: string;
  area: PlayerArea;
  own: boolean;
  observer: boolean;
  justifyContent: string;
}

function PlayedCards(props: PlayedCardsProps) {
  const classes = useStyles();

  const sacrificeCard = async (id: string) => {
    await api
      .post(
        HERO_REALMS_ENDPOINT +
          '/' +
          props.id +
          HERO_REALMS_SACRIFICE_CARD_ENDPOINT,
        {cardId: id, withAbility: true},
      )
      .then()
      .catch((error) => {});
  };

  const makeDecision = async (decisionId: string, optionId?: string) => {
    await api
      .post(
        HERO_REALMS_ENDPOINT +
          '/' +
          props.id +
          HERO_REALMS_MAKE_DECISION_ENDPOINT,
        {decisionId: decisionId, optionId: optionId},
      )
      .then()
      .catch((error) => {});
  };

  return (
    <Box className={classes.playedCardsAreaBox}>
      <Box className={classes.playedCardsAndDecsionsBox}>
        <Box
          className={classes.playedCards}
          justifyContent={props.justifyContent}
          style={{backgroundColor: playerColors[props.area.position]}}
        >
          {props.area.playedCards.length === 0 && (
            <Paper className={classes.emptyCard} />
          )}
          {props.area.playedCards.map((card) => {
            const sacrifice = props.own && card.sacrifice;
            return (
              <Card
                key={'playedCard' + card.id}
                alt={card.name}
                image={card.image}
                onClick={() => {
                  sacrificeCard(card.id);
                }}
                disabled={!sacrifice}
                ready
                sacrifice={sacrifice}
              />
            );
          })}
          {props.area.decisions?.length > 0 && (
            <Box className={classes.decisionBox}>
              {props.area.decisions.map((decision) => {
                if (decision.type === DecisionType.SELECT_ONE) {
                  return (
                    <ButtonGroup>
                      {decision.options.map((option) => {
                        return (
                          <Button
                            key={option.id}
                            className={classes.decisionButton}
                            onClick={() => {
                              makeDecision(decision.id, option.id);
                            }}
                            disabled={!props.own}
                          >
                            {option.text}
                          </Button>
                        );
                      })}
                    </ButtonGroup>
                  );
                } else {
                  const classNameDecisionButton = decision.active
                    ? clsx(classes.decisionButton, classes.decisionButtonActive)
                    : classes.decisionButton;

                  return (
                    <Button
                      key={decision.id}
                      className={classNameDecisionButton}
                      variant='outlined'
                      onClick={() => {
                        makeDecision(decision.id);
                      }}
                      disabled={!props.own}
                    >
                      {decision.text}
                    </Button>
                  );
                }
              })}
            </Box>
          )}
        </Box>
        <EndTurnButton {...props} />
      </Box>
    </Box>
  );
}

export interface EndTurnButtonProps {
  id: string;
  area: PlayerArea;
  own: boolean;
  observer: boolean;
}

function EndTurnButton(props: EndTurnButtonProps) {
  const classes = useStyles();

  const [endTurnButtonAvailable, setEndTurnButtonAvailable] =
    useState<boolean>(false);

  const openActions =
    props.area.combat + props.area.gold > 0 ||
    props.area.decisions == null ||
    props.area.decisions.length > 0;

  useEffect(() => {
    setEndTurnButtonAvailable(
      props.own && !props.observer && props.area.active,
    );
  }, [props.own, props.observer, props.area.active]);

  const endTurn = async () => {
    setEndTurnButtonAvailable(false);

    await api
      .post(
        HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_END_TURN_ENDPOINT,
      )
      .then()
      .catch((error) => {});
  };

  return (
    <Box className={classes.endTurnButtonBox}>
      <Box className={classes.endTurnButtonSpace} />
      {endTurnButtonAvailable && (
        <Button
          variant='contained'
          color={openActions ? 'default' : 'primary'}
          className={classes.endTurnButton}
          onClick={() => endTurn()}
        >
          <ExitToApp className={classes.endTurnButtonIcon} />
          {openActions ? '' : 'Zug beenden'}
        </Button>
      )}
    </Box>
  );
}

export default PlayedCards;
