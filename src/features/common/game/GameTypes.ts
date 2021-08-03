export interface GameParameter {
  id: string;
  name: string;
  image: string;
  minPlayer: number;
  maxPlayer: number;
}

export interface GameTable {
  id: string;
  no: number;
  created: number;
  game: string;
  stage: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
}