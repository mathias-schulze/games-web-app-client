import React from 'react'
import { Box, makeStyles } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { Card } from './HeroRealmsTable';
import api, { HERO_REALMS_ATTACK_ENDPOINT, HERO_REALMS_ENDPOINT, HERO_REALMS_PLAY_CHAMPION_ENDPOINT } from '../../common/api/api';

export const useStyles = makeStyles({
  playedChampions: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
  },
});

export interface PlayedChampionsProps {
  id: string;
  area: PlayerArea;
  attack?: boolean;
  availableCombat?: number;
  own?: boolean;
  justifyContent: string;
}

function PlayedChampions(props: PlayedChampionsProps) {

  const classes = useStyles(props);

  const area = props.area;
  const availableCombat = (props.availableCombat ? props.availableCombat : 0);

  const handleChampionClick = (championId:string, attack:number) => {

    if (props.own) {
      playChampion(championId);
    } else {
      sendAttack(championId, attack);
    }
  }

  const sendAttack = async (championId:string, attack:number) => {

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_ATTACK_ENDPOINT, 
            {playerId: area.playerId, championId: championId, value: attack})
        .then()
        .catch(error => {});
  };

  const playChampion = async (championId:string) => {

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_PLAY_CHAMPION_ENDPOINT, 
            {playerId: area.playerId, championId: championId})
        .then()
        .catch(error => {});
  };

  return (
    <Box>
      <Box className={classes.playedChampions} justifyContent={props.justifyContent}>
        {area.champions.map(champion => {
          const attack = (props.attack && availableCombat >= champion.defense);
          const disabled = !(attack || (props.own && area.active && champion.ready));
          return (
            <Card key={"playedChampion"+champion.id} alt={champion.name} image={champion.image}
                onClick={() => handleChampionClick(champion.id, champion.defense)} disabled={disabled}
                ready={champion.ready}/>
          )})
        }
      </Box>
    </Box>
  )
}

export default PlayedChampions
