import * as PIXI from "pixi.js";
import { Game } from "./main";

export class Player {
  game: Game;
  graphics: PIXI.Graphics;
  velY: number = 0;
  jumpStrength: number = -6;

  constructor(game: Game) {
    this.game = game;
    this.graphics = new PIXI.Graphics().circle(0, 0, 30).fill("green");
    this.eventListener();
  }

  public addPlayer(): void {
    this.game._player.graphics.x = this.game._app.canvas.width * 0.3;
    this.game._player.graphics.y = this.game._app.canvas.height / 2;
    this.game._app.stage.addChild(this.game._player.graphics);
  }

  private eventListener(): void {
    window.addEventListener("keydown", this.keyDown.bind(this));
  }

  private keyDown(e: KeyboardEvent): void {
    if (e.key === " ") {
      this.velY = this.jumpStrength;
    }
  }

  public movePlayer(): void {
    this.velY += 0.3;
    this.graphics.y += this.velY;
  }
}
