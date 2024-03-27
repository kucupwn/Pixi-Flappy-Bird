import * as PIXI from "pixi.js";
import { Game } from "./main";

export class GameWorld {
  game: Game;
  ceil: PIXI.Graphics;
  floor: PIXI.Graphics;

  constructor(game: Game) {
    this.game = game;
    this.ceil = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
    this.floor = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
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
    const obstacleHeights = this.getRandomHeights();

    let obstacleUpper = this.getObstacleUpper(obstacleHeights);
    this.game._app.stage.addChild(obstacleUpper);
    this.game.obstaclesArr.push(obstacleUpper);

    let obstacleLower = this.getObstacleLower(obstacleHeights);
    this.game._app.stage.addChild(obstacleLower);
    this.game.obstaclesArr.push(obstacleLower);
  }
}
