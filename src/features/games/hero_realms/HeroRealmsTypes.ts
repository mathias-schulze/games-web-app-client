export interface HeroRealmsTableView {
  players: Player[];
  cardBack: string;
  emptyDeck: string;
  fireGemsDeck: Deck;
  market: Card[];
  marketDeck: Deck;
  sacrificePile: Deck;
  ownPlayerArea: PlayerArea;
  otherPlayerAreas: PlayerArea[];
}

export interface Player {
	id: string;
	name: string;
}

export interface Deck {
  size: number;
  cards: Card[];
}

export interface Card {
  name: string;
  cost: number;
  defense: number;
  faction: string;
  type: string;
  image: string;
}

export interface PlayerArea {
  playerId: string;
  playerName: string;
	position: number;
  health: number;
  combat: number;
  gold: number;
  handSize: number;
  hand: Card[];
  deck: Deck;
  discardPile: Deck;
  playedCards: Card[];
  champions: Card[];
}
