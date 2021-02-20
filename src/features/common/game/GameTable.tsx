import React from 'react'
import HeroRealmsTable from '../../games/hero_realms/HeroRealmsTable'
import { GameType } from '../Const'

interface GameTableProps {
    id: string,
    game: string | undefined;
}

function GameTable(props: GameTableProps) {

  return (
    <div>
      {props.game === GameType.HERO_REALMS &&
        <HeroRealmsTable id={props.id}/>
      }
    </div>
  )
}

export default GameTable
