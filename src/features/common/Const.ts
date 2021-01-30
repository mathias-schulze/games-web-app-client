export class Game {
  
  public static HERO_REALMS = new Game("HERO_REALMS", "Hero Realms", "extern/hero_realms/hero_realms_back.jpg");
  
  constructor(id: string, name: string, image: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
  
  readonly id: string;
  readonly name: string;
  readonly image: string;
}

export const games = [
  Game.HERO_REALMS,
];

export enum Stage {
  NEW,
  PREPARE,
  RUNNING,
  FINISHED,
}