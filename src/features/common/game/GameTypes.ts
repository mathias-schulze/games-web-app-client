export interface Game {
  id: string;
  name: string;
  image: string;
}

export interface ActiveGame {
  id: string;
  no: number;
  created: number;
  game: string;
}