import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Avatar, Box, Button, Chip, IconButton, makeStyles, Popover, Typography } from '@material-ui/core';
import { HeroRealmsTableView, PlayerArea } from './HeroRealmsTypes';
import { Alarm, FirstPage, LastPage, NavigateBefore, NavigateNext, Security } from '@material-ui/icons';
import api, { HERO_REALMS_ATTACK_ENDPOINT, HERO_REALMS_ENDPOINT } from '../../common/api/api';
import { green, yellow, red, grey } from '@material-ui/core/colors';
import moment from 'moment';

export const useStyles = makeStyles(theme => ({
  indicator: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  title: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexBasis: "33%",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  faction: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    flexBasis: "34%",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "inherit",
    height: "40px",
  },
  healthGoldCombat: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexBasis: "33%",
    margin: theme.spacing(1),
  },
  timer: {
    margin: theme.spacing(1),
    height: "40px",
    color: 'black',
    fontWeight: 'bold',
    fontSize: '14px',
    backgroundColor: grey[500],
  },
  timerIcon: {
    color: 'black',
  },
  health: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    color: 'black',
    backgroundColor: green[400],
    "&$buttonDisabled": {
      color: 'black',
    },
  },
  killed: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    color: 'black',
    backgroundColor: grey[400],
    "&$buttonDisabled": {
      color: 'black',
    },
  },
  gold: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    color: 'black',
    backgroundColor: yellow[600],
    "&$buttonDisabled": {
      color: 'black',
    },
  },
  combat: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    color: 'black',
    backgroundColor: red[400],
    "&$buttonDisabled": {
      color: 'black',
    },
  },
  buttonDisabled: {
    disabled: 'black',
  },
}));

interface HealthGoldCombatIndicatorProps {
  id: string;
  table: HeroRealmsTableView;
  area: PlayerArea;
  availableCombat?: number;
  observer: boolean;
}

function HealthGoldCombatIndicator(props: HealthGoldCombatIndicatorProps) {

  const classes = useStyles();

  const area = props.area;
  const [time, setTime] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const attackAvailable = (props.availableCombat && props.availableCombat > 0);
  const attackPopoverOpen = Boolean(anchorEl && attackAvailable);
  const [attack, setAttack] = useState(0);
  const hasGuard = (area.champions.filter(champion => {return (champion.type === "GUARD")}).length > 0);
  const healthClass = area.killed ? classes.killed : classes.health;
  
  const updateTimer = useCallback(async () => {
    setTime("");
    const start = props.table.currentTurnStart;
    if (area.active && start > 0) {
      const currentTime = moment();
      const duration = moment.duration(currentTime.diff(moment(props.table.currentTurnStart)));
      if (duration.asHours() < 1) {
        setTime(moment.utc(duration.asMilliseconds()).format("mm:ss"));
      }
    }
  }, [area.active, props.table.currentTurnStart])

  useEffect(() => {
    const startUpdateTimer = setInterval(() => updateTimer(), 1000);
    return () => clearInterval(startUpdateTimer);
  }, [area.active, updateTimer]);
  
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

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_ATTACK_ENDPOINT, {playerId: area.playerId, value: attack})
        .then()
        .catch(error => {});
  };

  const decreaseAttack = () => {setAttack(attack-1)}
  const decreaseAttackMin = () => {setAttack(0)}
  const increaseAttack = () => {setAttack(attack+1)}
  const increaseAttackMax = () => {setAttack(props.availableCombat ? props.availableCombat : 0)}

  return (
    <Box className={classes.indicator}>
      <Box className={classes.title}>
        <Typography variant="h6">{area.playerName}</Typography>
      </Box>

      <Box className={classes.faction}>
        {area.factionCountGuild > 0 && <img src="..//..//extern//hero_realms//guild_icon.png" alt="guild"/>}
        {area.factionCountImperial > 0 && <img src="..//..//extern//hero_realms//imperial_icon.png" alt="imperial"/>}
        {area.factionCountNecros > 0 && <img src="..//..//extern//hero_realms//necros_icon.png" alt="necros"/>}
        {area.factionCountWild > 0 && <img src="..//..//extern//hero_realms//wild_icon.png" alt="wild"/>}
      </Box>

      <Box className={classes.healthGoldCombat}>
        {time.length > 0 && <Chip icon={<Alarm className={classes.timerIcon}/>} label={time} className={classes.timer}/>}
      <Avatar className={healthClass} aria-owns={attackPopoverOpen ? 'attack-popover' : undefined} aria-haspopup="true">
        <Button onClick={handleAttackClick} disabled={props.observer || !attackAvailable}
            classes={{ root: healthClass, disabled: classes.buttonDisabled }}>
          {area.health}
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
      {area.active &&
        <Fragment>
          <Avatar className={classes.gold}>
            <Button classes={{ root: classes.gold, disabled: classes.buttonDisabled }} disabled>{area.gold}</Button>
          </Avatar>
          <Avatar className={classes.combat}>
            <Button classes={{ root: classes.combat, disabled: classes.buttonDisabled }} disabled>{area.combat}</Button>
          </Avatar>
        </Fragment>
      }
      </Box>
    </Box>
  )
}

export default HealthGoldCombatIndicator
