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

  // Initialize bird texture and wing animation
  public async initBirdSprite(): Promise<void> {
    const birdImages = [
      "/assets/Sprites/yellowbird-upflap.png",
      "/assets/Sprites/yellowbird-midflap.png",
      "/assets/Sprites/yellowbird-downflap.png",
    ];

    const textureArr: PIXI.Texture[] = [];

    for (const image of birdImages) {
      const texture = await PIXI.Assets.load(image);
      textureArr.push(texture);
    }

    const animatedBirdSprite = new PIXI.AnimatedSprite(textureArr);
    this.setPlayer(animatedBirdSprite);
  }

  // Add and set bird position
  public setPlayer(bird: PIXI.AnimatedSprite): void {
    this.bird = bird;
    this.bird.anchor.set(0.5);
    this.bird.animationSpeed = 0.1;
    this.bird.x = Math.floor(this.game._app.canvas.width / 3);
    this.bird.y = this.game._app.canvas.height / 2;
    this.game._app.stage.addChild(this.bird);
  }

  // Event listener for jump
  private jumpEventListener(): void {
    window.addEventListener("keydown", this.keyDown.bind(this));
  }

  // Jump, play wing sound
  private keyDown(e: KeyboardEvent): void {
    if (e.key === " " && !this.game.keylock) {
      this.velY = this.jumpStrength;
      if (this.game.gameRunning) {
        sound.play("wing");
      }
    }
  }

  // Set player velocity, position, rotation
  public movePlayer(): void {
    this.velY += 0.3;
    this.bird.y += this.velY;
    this.bird.rotation = Math.atan2(this.velY, 45);
  }

  // Reset player
  public resetPlayer(): void {
    this.bird.x = Math.floor(this.game._app.canvas.width / 3);
    this.bird.y = this.game._app.canvas.height / 2;
    this.velY = 0;
    this.bird.rotation = 0;
    this.bird.gotoAndStop(0);
  }
}
