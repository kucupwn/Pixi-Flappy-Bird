import * as PIXI from "pixi.js";
import { Player } from "./player";
import { GameWorld } from "./gameWorld";
import { Texts } from "./texts";
import { sound } from "@pixi/sound";
import { collideWithBoundaries, collideWithObstacles } from "./collisionCheck";

const appContainer = document.getElementById("app");

export class Game {
  _app: PIXI.Application;
  _player: Player;
  _gameWorld: GameWorld;
  _texts: Texts;
  gameRunning: boolean = false;
  tickerAdded: boolean = false;
  keylock: boolean = false;
  score: number = 0;
  highScore: number = 0;
  hitSound: boolean = false;

  constructor() {
    this._app = new PIXI.Application();
    this._player = new Player(this);
    this._gameWorld = new GameWorld(this);
    this._texts = new Texts(this);
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    appContainer?.appendChild(this._app.canvas);
    await this._gameWorld.initGameWorldSprites();
    await this._player.initBirdSprite();

    this.addSounds();
    this.gameStatus();
    this._texts.controlInfo();
    this._texts.displayScore();
    this._texts.displayHighscore();
  }

  private addSounds() {
    sound.add("wing", "./sounds/sfx_wing.wav");
    sound.add("point", "./sounds/sfx_point.wav");
    sound.add("hit", "./sounds/sfx_hit.wav");
  }

  private startGame() {
    this.gameRunning = true;
    this._app.stage.removeChild(this._texts.startInfo);
    this._app.stage.removeChild(this._texts.pauseInfo);
    this._app.stage.removeChild(this._texts.restartInfo);
  }

  private playHitSound() {
    if (!this.hitSound) {
      sound.play("hit");
      this.hitSound = true;
    } else {
      this.hitSound = false;
    }
  }

  private gameStatus() {
    window.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.gameRunning &&
        this._gameWorld.obstaclesArr.length > 2
      ) {
        this.keylock = true;
        this.gameRunning = false;
        this._player.bird.stop();
        this._app.ticker.stop();
      } else if (
        e.key === "Escape" &&
        !this.gameRunning &&
        this._gameWorld.obstaclesArr.length > 2
      ) {
        this.keylock = false;
        this.gameRunning = true;
        this._player.bird.play();
        this._app.ticker.start();
      }
    });

    if (!this.tickerAdded) {
      window.addEventListener("keydown", (e) => {
        if (
          e.key === " " &&
          !this.gameRunning &&
          !this.tickerAdded &&
          !this.keylock
        ) {
          this.startGame();
          this._app.ticker.add(this.gameLoop.bind(this));
          this.tickerAdded = true;
        }
      });
    } else if (this.tickerAdded) {
      window.addEventListener("keydown", (e) => {
        if (
          e.key === " " &&
          !this.gameRunning &&
          this.tickerAdded &&
          !this.keylock
        ) {
          this.startGame();
        }
      });
    }
  }

  public resetGame() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !this.keylock) {
        this.gameRunning = false;
        this.score = 0;
        this._texts.displayScore();
        this._player.resetPlayer();
        this._gameWorld.resetGameWorld();
        this._app.stage.addChild(this._texts.startInfo);
        this._app.stage.addChild(this._texts.pauseInfo);
        this._app.stage.addChild(this._texts.restartInfo);
        this.hitSound = false;
        this.gameStatus();
      }
    });
  }

  public gameLoop(): void {
    if (
      this.gameRunning &&
      !collideWithBoundaries(this) &&
      !collideWithObstacles(this)
    ) {
      this._texts.displayScore();
      this._player.movePlayer();
      this._gameWorld.getObstacles(this._gameWorld.obstacleTexture);
      this._gameWorld.gameWorldSpeedProgression();
      this._player.bird.play();
      this._gameWorld.obstaclesArr.forEach((obs) => {
        this._gameWorld.obstacleSpeedProgression(obs);
      });
      this.resetGame();
    } else if (
      !this.gameRunning &&
      (collideWithBoundaries(this) || collideWithObstacles(this))
    ) {
      this._player.bird.stop();
      this._texts.setHighscore();
      this._texts.displayHighscore();
      this.playHitSound();
      this._app.ticker.stop();
    }
    this.resetGame();
  }
}

const game = new Game();
game.init();

window.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    !game.gameRunning &&
    (collideWithBoundaries(game) || collideWithObstacles(game))
  ) {
    game._app.ticker.start();
    game.resetGame();
  }
});
