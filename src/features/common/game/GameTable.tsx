import React from 'react'
import HeroRealmsTable from '../../games/hero_realms/HeroRealmsTable'
import { GameType, Stage } from '../Const'

interface GameTableProps {
    id: string,
    game: string | undefined;
    stage: Stage;
}

function GameTable(props: GameTableProps) {

  return (
    <div>
      {(props.game === GameType.HERO_REALMS || props.game === GameType.HERO_REALMS_CHARACTER_PACKS) &&
        <HeroRealmsTable id={props.id} stage={props.stage}/>
      }
    </div>
  )
}

export default GameTable
