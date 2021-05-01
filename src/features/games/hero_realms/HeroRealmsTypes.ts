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
  stunnedSinceLastTurn: boolean;
}

export enum CardType {
  ITEM = 'ITEM',
	ACTION = 'ACTION',
	CHAMPION = 'CHAMPION',
	GUARD = 'GUARD',
}

export interface PlayerArea {
  playerId: string;
  playerName: string;
  characterRoundAbilityActive?: boolean;
  characterRoundAbilityImage?: string;
  characterOneTimeAbilityImage?: string;
  active: boolean;
  actionMode: SpecialActionMode;
  selected4Discard: boolean;
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
  rangerTrackCards: Card[];
  rangerTrackDiscardCount: number;
}

export enum SpecialActionMode {
  DISCARD = 'DISCARD',
  OPPONENT_DISCARD_CARD = 'OPPONENT_DISCARD_CARD',
  PREPARE_CHAMPION = 'PREPARE_CHAMPION',
  STUN_TARGET_CHAMPION = 'STUN_TARGET_CHAMPION',
  PUT_CARD_DISCARD_PILE_TOP_DECK = 'PUT_CARD_DISCARD_PILE_TOP_DECK',
  PUT_CHAMPION_DISCARD_PILE_TOP_DECK = 'PUT_CHAMPION_DISCARD_PILE_TOP_DECK',
  SACRIFICE = 'SACRIFICE',
  CLERIC_BLESS = 'CLERIC_BLESS',
  PUT_CHAMPION_DISCARD_INTO_PLAY = 'PUT_CHAMPION_DISCARD_INTO_PLAY',
  RANGER_TRACK = 'RANGER_TRACK',
}

export interface Decision {
	id: string;
	type: DecisionType;
	text: string;
  active: boolean;
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
