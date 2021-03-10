import React from 'react'
import { Box, makeStyles } from '@material-ui/core';
import { PlayerArea } from './HeroRealmsTypes'
import { Card } from './HeroRealmsTable';
import api, { HERO_REALMS_ATTACK_ENDPOINT, HERO_REALMS_ENDPOINT } from '../../common/api/api';

export const useStyles = makeStyles({
  playedCahmpions: {
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
  justifyContent: string;
}

function PlayedChampions(props: PlayedChampionsProps) {

  const classes = useStyles(props);

  const availableCombat = (props.availableCombat ? props.availableCombat : 0);

  const sendAttack = async (championId:string, attack:number) => {

    await api.post(HERO_REALMS_ENDPOINT + '/' + props.id + HERO_REALMS_ATTACK_ENDPOINT, 
            {playerId: props.area.playerId, championId: championId, value: attack})
        .then()
        .catch(error => {});
  };

  return (
    <Box>
      <Box className={classes.playedCahmpions} justifyContent={props.justifyContent}>
        {props.area.champions.map(champion => {
          const attack = (props.attack && availableCombat >= champion.defense);
          return (
            <Card key={"playedChampion"+champion.id} alt={champion.name} image={champion.image}
                onClick={() => sendAttack(champion.id, champion.defense)} disabled={!attack}/>
          )})
        }
      </Box>
    </Box>
  )
}

export default PlayedChampions
