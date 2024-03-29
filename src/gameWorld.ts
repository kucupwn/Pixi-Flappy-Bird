import * as PIXI from "pixi.js";
import { Game } from "./main";

export class GameWorld {
  game: Game;
  background: PIXI.TilingSprite;
  ceil: PIXI.TilingSprite;
  floor: PIXI.TilingSprite;
  obstacleTexture: PIXI.Texture;
  obstaclesArr: PIXI.Sprite[] = [];
  obstacleDistance: number = 400;

  constructor(game: Game) {
    this.game = game;
    this.ceil = new PIXI.TilingSprite();
    this.floor = new PIXI.TilingSprite();
    this.background = new PIXI.TilingSprite();
    this.initGameWorldSprites();
    this.obstacleTexture = new PIXI.Texture();
  }

  public async initGameWorldSprites(): Promise<void> {
    const backgroundTexture = await PIXI.Assets.load(
      "./assets/background-day.png"
    );
    const tilingBackgroundSprite = PIXI.TilingSprite.from(backgroundTexture);
    this.setBackgroundSprite(tilingBackgroundSprite);

    const floorTexture = await PIXI.Assets.load("./assets/base.png");
    const tilingFloorSprite = PIXI.TilingSprite.from(floorTexture);
    this.setFloorSprite(tilingFloorSprite);

    const ceilTexture = await PIXI.Assets.load("./assets/base.png");
    const tilingCeilSprite = PIXI.TilingSprite.from(ceilTexture);
    this.setCeilSprite(tilingCeilSprite);

    const obstacleTexture = await PIXI.Assets.load("./assets/pipe-green.png");
    this.obstacleTexture = obstacleTexture;
    this.initObstacles(this.obstacleTexture);
  }

  private initObstacles(texture: PIXI.Texture) {
    const firstObs1 = PIXI.Sprite.from(texture);
    this.game._app.stage.addChild(firstObs1);
    firstObs1.x = this.game._app.canvas.width - 200;
    firstObs1.y = 150;
    firstObs1.scale.y *= -1;
    this.obstaclesArr.push(firstObs1);

    const firstObs2 = PIXI.Sprite.from(texture);
    this.game._app.stage.addChild(firstObs2);
    firstObs2.x = this.game._app.canvas.width - 200;
    firstObs2.y = 350;
    this.obstaclesArr.push(firstObs2);
  }

  private getObstaclePair(texture: PIXI.Texture): void {
    const obstacleClone1 = PIXI.Sprite.from(texture);
    const obstacleClone2 = PIXI.Sprite.from(texture);

    this.game._app.stage.addChild(obstacleClone1);
    this.game._app.stage.addChild(obstacleClone2);
  }

  private setBackgroundSprite(background: PIXI.TilingSprite) {
    this.background = background;
    this.game._app.stage.addChild(background);
    background.width = this.game._app.canvas.width;
  }

  private setCeilSprite(ceil: PIXI.TilingSprite) {
    this.ceil = ceil;
    this.game._app.stage.addChild(this.ceil);
    this.ceil.scale.y *= -1;
    this.ceil.y = 20;
    this.ceil.width = this.game._app.canvas.width;
  }

  private setFloorSprite(floor: PIXI.TilingSprite) {
    this.floor = floor;
    this.game._app.stage.addChild(this.floor);
    this.floor.y = this.game._app.canvas.height * 0.9;
    this.floor.width = this.game._app.canvas.width;
  }

  public animateWorld(): void {
    this.background.tilePosition.x -= 0.1;
    this.ceil.tilePosition.x -= 5;
    this.floor.tilePosition.x -= 5;
  }

  // private getRandomHeights(): number[] {
  //   const obstacleSumHeight = this.game._app.canvas.height - 200;
  //   const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight);
  //   const randomHeight2 = obstacleSumHeight - randomHeight1;

  //   return [randomHeight1, randomHeight2];
  // }

  // private getObstacleUpper(obstacleHeights: number[]): PIXI.Graphics {
  //   const obstacleUpper = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");
  //   obstacleUpper.height = obstacleHeights[0];
  //   obstacleUpper.x = this.game._app.canvas.width;
  //   obstacleUpper.y += this.ceil.height;

  //   return obstacleUpper;
  // }

  // private getObstacleLower(obstacleHeights: number[]): PIXI.Graphics {
  //   const obstacleLower = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");

  //   obstacleLower.height = obstacleHeights[1];
  //   obstacleLower.x = this.game._app.canvas.width;
  //   obstacleLower.y =
  //     this.game._app.canvas.height - obstacleLower.height - this.floor.height;

  //   return obstacleLower;
  // }

  // public getObstacles(): void {
  //   const obstacleHeights: number[] = this.getRandomHeights();
  //   let obstacleUpper = this.getObstacleUpper(obstacleHeights);
  //   let obstacleLower = this.getObstacleLower(obstacleHeights);
  //   let distance =
  //     this.game.obstaclesArr[this.game.obstaclesArr.length - 1]?.x >
  //     this.obstacleDistance;

  //   if (this.game.gameRunning && !distance) {
  //     this.game._app.stage.addChild(obstacleUpper);
  //     this.game.obstaclesArr.push(obstacleUpper);

  //     this.game._app.stage.addChild(obstacleLower);
  //     this.game.obstaclesArr.push(obstacleLower);
  //   }
  // }
}
