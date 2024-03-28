import * as PIXI from "pixi.js";
import { Game } from "./main";

export class GameWorld {
  game: Game;
  background: PIXI.TilingSprite;
  ceil: PIXI.Graphics;
  floor: PIXI.Graphics;
  obstacleDistance: number = 400;

  constructor(game: Game) {
    this.game = game;
    this.ceil = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
    this.floor = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
    this.background = new PIXI.TilingSprite();
    this.loadBackgroundSprite();
  }

  public async loadBackgroundSprite(): Promise<void> {
    const texture = await PIXI.Assets.load("./assets/background-day.png");
    const tilingTexture = PIXI.TilingSprite.from(texture);
    this.setBackgroundSprite(tilingTexture);
  }

  private setBackgroundSprite(background: PIXI.TilingSprite) {
    this.background = background;
    this.game._app.stage.addChild(background);
    background.width = this.game._app.canvas.width;
  }

  public animateBackground(): void {
    this.background.tilePosition.x -= 0.1;
  }

  public addBoundaries(): void {
    this.game._gameWorld.ceil.width = this.game._app.canvas.width;
    this.game._app.stage.addChild(this.game._gameWorld.ceil);

    this.game._gameWorld.floor.width = this.game._app.canvas.width;
    this.game._gameWorld.floor.y =
      this.game._app.canvas.height - this.game._gameWorld.floor.height;
    this.game._app.stage.addChild(this.game._gameWorld.floor);
  }

  private getRandomHeights(): number[] {
    const obstacleSumHeight = this.game._app.canvas.height - 200;
    const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight);
    const randomHeight2 = obstacleSumHeight - randomHeight1;

    return [randomHeight1, randomHeight2];
  }

  private getObstacleUpper(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleUpper = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");
    obstacleUpper.height = obstacleHeights[0];
    obstacleUpper.x = this.game._app.canvas.width;
    obstacleUpper.y += this.ceil.height;

    return obstacleUpper;
  }

  private getObstacleLower(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleLower = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");

    obstacleLower.height = obstacleHeights[1];
    obstacleLower.x = this.game._app.canvas.width;
    obstacleLower.y =
      this.game._app.canvas.height - obstacleLower.height - this.floor.height;

    return obstacleLower;
  }

  public getObstacles(): void {
    const obstacleHeights: number[] = this.getRandomHeights();
    let obstacleUpper = this.getObstacleUpper(obstacleHeights);
    let obstacleLower = this.getObstacleLower(obstacleHeights);
    let distance =
      this.game.obstaclesArr[this.game.obstaclesArr.length - 1]?.x >
      this.obstacleDistance;

    if (this.game.gameRunning && !distance) {
      this.game._app.stage.addChild(obstacleUpper);
      this.game.obstaclesArr.push(obstacleUpper);

      this.game._app.stage.addChild(obstacleLower);
      this.game.obstaclesArr.push(obstacleLower);
    }
  }
}
