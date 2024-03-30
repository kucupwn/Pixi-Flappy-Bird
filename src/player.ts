import * as PIXI from "pixi.js";
import { Game } from "./main";

export class Player {
  game: Game;
  bird: PIXI.Sprite;
  velY: number = 0;
  jumpStrength: number = -6;

  constructor(game: Game) {
    this.game = game;
    this.bird = new PIXI.Sprite();
    this.jumpEventListener();
  }

  public async initBirdSprite() {
    const birdTexture = await PIXI.Assets.load(
      "./assets/yellowbird-upflap.png"
    );
    const birdSprite = PIXI.Sprite.from(birdTexture);
    this.setPlayer(birdSprite);
  }

  public setPlayer(bird: PIXI.Sprite): void {
    this.bird = bird;
    this.bird.anchor.set(0.5);
    this.bird.x = this.game._app.canvas.width * 0.3;
    this.bird.y = this.game._app.canvas.height / 2;
    this.game._app.stage.addChild(this.bird);
  }

  private jumpEventListener(): void {
    window.addEventListener("keydown", this.keyDown.bind(this));
  }

  private keyDown(e: KeyboardEvent): void {
    if (e.key === " " && !this.game.keylock) {
      this.velY = this.jumpStrength;
    }
  }

  public movePlayer(): void {
    this.velY += 0.3;
    this.bird.y += this.velY;
    this.bird.rotation = Math.atan2(this.velY, 45);
  }

  public resetPlayer() {
    this.bird.x = this.game._app.canvas.width * 0.3;
    this.bird.y = this.game._app.canvas.height / 2;
    this.velY = 0;
    this.bird.rotation = 0;
  }
}
