import React, { Fragment, useState } from 'react'
import { Avatar, Box, Button, IconButton, Popover } from '@material-ui/core';
import { useStyles } from './HeroRealmsTableStyles'
import { PlayerArea } from './HeroRealmsTypes';
import { FirstPage, LastPage, NavigateBefore, NavigateNext, Security } from '@material-ui/icons';
import api, { HERO_REALMS_ATTACK_ENDPOINT, HERO_REALMS_ENDPOINT } from '../../common/api/api';

interface HealthGoldCombatIndicatorProps {
  id: string;
  area: PlayerArea;
  availableCombat?: number;
}

function HealthGoldCombatIndicator(props: HealthGoldCombatIndicatorProps) {

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const attackAvailable = (props.availableCombat && props.availableCombat > 0);
  const attackPopoverOpen = Boolean(anchorEl && attackAvailable);
  const [attack, setAttack] = useState(0);
  const hasGuard = (props.area.champions.filter(champion => {return (champion.type === "GUARD")}).length > 0);

  function handleAttackClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  const handleAttackClose = () => {
    setAnchorEl(null);
    setAttack(0)
  };

  const sendAttack = async () => {
    setAnchorEl(null);
    setAttack(0)

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_ATTACK_ENDPOINT, {playerId: props.area.playerId, value: attack})
        .then()
        .catch(error => {});
  };

  const decreaseAttack = () => {setAttack(attack-1)}
  const decreaseAttackMin = () => {setAttack(0)}
  const increaseAttack = () => {setAttack(attack+1)}
  const increaseAttackMax = () => {setAttack(props.availableCombat ? props.availableCombat : 0)}

  return (
    <Box display="flex" justifyContent="flex-end">
      <Avatar className={classes.health} aria-owns={attackPopoverOpen ? 'attack-popover' : undefined} aria-haspopup="true">
        <Button onClick={handleAttackClick} disabled={!attackAvailable}
            classes={{ root: classes.health, disabled: classes.buttonDisabled }}>
          {props.area.health}
        </Button>
      </Avatar>
      <Popover id="attack-popover"
          open={attackPopoverOpen} anchorEl={anchorEl} onClose={handleAttackClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Box display="flex">
          <IconButton onClick={decreaseAttackMin} disabled={hasGuard || attack === 0}>
            <FirstPage/>
          </IconButton>
          <IconButton onClick={decreaseAttack} disabled={hasGuard || attack === 0}>
            <NavigateBefore/>
          </IconButton>
          {!hasGuard &&
            <Avatar className={classes.combat}>
              <Button onClick={sendAttack} disabled={attack === 0}
                  classes={{ root: classes.combat, disabled: classes.buttonDisabled }}>
                {attack}
              </Button>
            </Avatar>
          }
          {hasGuard &&
            <IconButton disabled>
              <Security/>
            </IconButton>
          }
          <IconButton onClick={increaseAttack} disabled={hasGuard || attack === props.availableCombat}>
            <NavigateNext/>
          </IconButton>
          <IconButton onClick={increaseAttackMax} disabled={hasGuard || attack === props.availableCombat}>
            <LastPage/>
          </IconButton>
        </Box>
      </Popover>
      {props.area.active &&
        <Fragment>
          <Avatar className={classes.gold}>
            <Button classes={{ root: classes.gold, disabled: classes.buttonDisabled }} disabled>{props.area.gold}</Button>
          </Avatar>
          <Avatar className={classes.combat}>
            <Button classes={{ root: classes.combat, disabled: classes.buttonDisabled }} disabled>{props.area.combat}</Button>
          </Avatar>
        </Fragment>
      }
    </Box>
  )
}

export default HealthGoldCombatIndicator
