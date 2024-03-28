import * as PIXI from "pixi.js";

export class Player {
  graphics: PIXI.Graphics;
  velY: number = 0;
  jumpStrength: number = -6;

  constructor() {
    this.graphics = new PIXI.Graphics().circle(0, 0, 30).fill("green");
    this.eventListener();
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
