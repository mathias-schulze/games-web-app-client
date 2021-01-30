import React from 'react'
import { useParams } from 'react-router-dom';

interface UrlParams {
    id: string;
}

function Game() {

  const params = useParams<UrlParams>();

  return (
    <div>
      {params.id}
    </div>
  )
}

export default Game
