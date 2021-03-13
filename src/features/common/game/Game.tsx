import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { firestore, COLLECTION_GAMES } from '../firebase/Firebase';
import StartGameDialog from './StartGameDialog';
import { Stage } from '../Const';
import GameTable from './GameTable';

interface UrlParams {
    id: string;
}

function Game() {

  const params = useParams<UrlParams>();
  const [stage, setStage] = useState<string>()
  const [game, setGame] = useState<string>()

  useEffect(() => {
    const unsubscribe = firestore.collection(COLLECTION_GAMES).doc(params.id).onSnapshot((doc) => {
      setStage(doc.data()?.stage);
      setGame(doc.data()?.game);
    });
    return () => {unsubscribe()};
  }, [params.id])

  return (
    <div>
      {(stage === Stage.NEW) &&
        <StartGameDialog id={params.id}/>
      }
      {(stage === Stage.RUNNING || stage === Stage.FINISHED) &&
        <GameTable id={params.id} game={game} stage={stage}/>
      }
    </div>
  )
}

export default Game
