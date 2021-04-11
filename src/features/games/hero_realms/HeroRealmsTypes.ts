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
  actionMode: SpecialActionMode;
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
  decisions: Decision[];
  factionCountGuild: number;
  factionCountImperial: number;
  factionCountNecros: number;
  factionCountWild: number;
}

export enum SpecialActionMode {
  DISCARD = 'DISCARD',
  PREPARE_CHAMPION = 'PREPARE_CHAMPION',
  STUN_TARGET_CHAMPION = 'STUN_TARGET_CHAMPION',
  SACRIFICE = 'SACRIFICE',
}

export interface Decision {
	id: string;
	type: DecisionType;
	text: string;
	options: DecisionOption[];
}

export enum DecisionType {
  SELECT_ONE = 'SELECT_ONE',
	OPTIONAL = 'OPTIONAL',
}

export interface DecisionOption {
	id: string;
	text: string;
}
