import * as PIXI from "pixi.js";
import { Game } from "./main";

export class GameWorld {
  game: Game;
  background: PIXI.TilingSprite;
  ceil: PIXI.TilingSprite;
  floor: PIXI.TilingSprite;
  animationSpeed: number = 6;
  obstacleTexture: PIXI.Texture;
  obstaclesArr: PIXI.Sprite[] = [];
  obstacleGap: number = 120;
  obstacleDistance: number = 400;
  pointSound: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.ceil = new PIXI.TilingSprite();
    this.floor = new PIXI.TilingSprite();
    this.background = new PIXI.TilingSprite();
    this.obstacleTexture = new PIXI.Texture();
  }

  public async initGameWorldSprites(): Promise<void> {
    const backgroundTexture = await PIXI.Assets.load(
      "./assets/Sprites/background-day.png"
    );
    const tilingBackgroundSprite = PIXI.TilingSprite.from(backgroundTexture);
    this.setBackgroundSprite(tilingBackgroundSprite);

    const floorTexture = await PIXI.Assets.load("./assets/Sprites/base.png");
    const tilingFloorSprite = PIXI.TilingSprite.from(floorTexture);
    this.setFloorSprite(tilingFloorSprite);

    const ceilTexture = await PIXI.Assets.load("./assets/Sprites/base.png");
    const tilingCeilSprite = PIXI.TilingSprite.from(ceilTexture);
    this.setCeilSprite(tilingCeilSprite);

    const obstacleTexture = await PIXI.Assets.load(
      "./assets/Sprites/pipe-green.png"
    );
    this.obstacleTexture = obstacleTexture;
    this.initObstacles(this.obstacleTexture);
  }

  private setBackgroundSprite(background: PIXI.TilingSprite) {
    this.background = background;
    this.game._app.stage.addChild(background);
    background.width = this.game._app.canvas.width;
  }

  private setCeilSprite(ceil: PIXI.TilingSprite) {
    this.ceil = ceil;
    this.game._app.stage.addChild(this.ceil);
    this.ceil.zIndex = 1;
    this.ceil.scale.y *= -1;
    this.ceil.y = 20;
    this.ceil.width = this.game._app.canvas.width;
  }

  private setFloorSprite(floor: PIXI.TilingSprite) {
    this.floor = floor;
    this.game._app.stage.addChild(this.floor);
    this.floor.zIndex = 1;
    this.floor.y = this.game._app.canvas.height * 0.9;
    this.floor.width = this.game._app.canvas.width;
  }

  private initObstacles(texture: PIXI.Texture) {
    const firstObs1 = PIXI.Sprite.from(texture);
    this.game._app.stage.addChild(firstObs1);
    firstObs1.x = this.game._app.canvas.width;
    firstObs1.y = 180;
    firstObs1.scale.y *= -1;
    this.obstaclesArr.push(firstObs1);

    const firstObs2 = PIXI.Sprite.from(texture);
    this.game._app.stage.addChild(firstObs2);
    firstObs2.x = this.game._app.canvas.width;

    firstObs2.y = firstObs1.y + this.obstacleGap;
    this.obstaclesArr.push(firstObs2);
  }

  public resetGameWorld() {
    this.obstaclesArr.forEach((obstacle) => {
      this.game._app.stage.removeChild(obstacle);
    });
    this.obstaclesArr = [];
    this.initObstacles(this.obstacleTexture);
  }
}
