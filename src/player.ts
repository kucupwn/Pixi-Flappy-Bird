import * as PIXI from "pixi.js";
import { Game } from "./main";
import { sound } from "@pixi/sound";

export class Player {
  game: Game;
  bird: PIXI.AnimatedSprite;
  velY: number = 0;
  jumpStrength: number = -6;

  constructor(game: Game) {
    this.game = game;
    const placeholderTexture = PIXI.Texture.WHITE;
    this.bird = new PIXI.AnimatedSprite([placeholderTexture]);
    this.jumpEventListener();
  }

  public async initBirdSprite() {
    const birdImages = [
      "./assets/yellowbird-upflap.png",
      "./assets/yellowbird-midflap.png",
      "./assets/yellowbird-downflap.png",
    ];

    const textureArr: PIXI.Texture[] = [];

    for (const image of birdImages) {
      const texture = await PIXI.Assets.load(image);
      textureArr.push(texture);
    }

    const animatedBirdSprite = new PIXI.AnimatedSprite(textureArr);
    this.setPlayer(animatedBirdSprite);
  }

  public setPlayer(bird: PIXI.AnimatedSprite): void {
    this.bird = bird;
    this.bird.anchor.set(0.5);
    this.bird.animationSpeed = 0.1;
    this.bird.x = 180;
    this.bird.y = this.game._app.canvas.height / 2;
    this.game._app.stage.addChild(this.bird);
  }

  private jumpEventListener(): void {
    window.addEventListener("keydown", this.keyDown.bind(this));
  }

  private keyDown(e: KeyboardEvent): void {
    if (e.key === " " && !this.game.keylock) {
      this.velY = this.jumpStrength;
      if (this.game.gameRunning) {
        sound.play("wing");
      }
    }
  }

  public movePlayer(): void {
    this.velY += 0.3;
    this.bird.y += this.velY;
    this.bird.rotation = Math.atan2(this.velY, 45);
  }

  public resetPlayer(): void {
    this.bird.x = 180;
    this.bird.y = this.game._app.canvas.height / 2;
    this.velY = 0;
    this.bird.rotation = 0;
    this.bird.gotoAndStop(0);
  }
}
