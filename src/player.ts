import * as PIXI from "pixi.js";

export class Player {
  graphics: PIXI.Graphics;
  keys: { [key: string]: boolean } = {};

  constructor() {
    this.graphics = new PIXI.Graphics().circle(0, 0, 30).fill("green");
    this.eventListener();
  }

  private eventListener(): void {
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

  private keyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  private keyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  public movePlayer(): void {
    if (this.keys[" "]) {
      this.graphics.y -= 5;
    } else {
      this.graphics.y += 5;
    }
  }
}
