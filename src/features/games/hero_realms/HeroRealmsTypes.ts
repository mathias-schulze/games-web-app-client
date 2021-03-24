export interface HeroRealmsTableViewProps {
  id: string;
  table: HeroRealmsTableView;
}

export interface HeroRealmsTableView {
  players: Player[];
  activePlayer: Player;
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
  id: string;
  name: string;
  cost: number;
  defense: number;
  faction: string;
  type: string;
  image: string;
  ready: boolean;
  sacrifice: boolean;
}

export interface PlayerArea {
  playerId: string;
  playerName: string;
  active: boolean;
  killed: boolean;
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
  factionCountGuild: number;
  factionCountImperial: number;
  factionCountNecros: number;
  factionCountWild: number;
}
