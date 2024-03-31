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
    this._texts.initFps();
    this._texts.controlInfo();
    this._texts.displayScore();
    this._texts.displayHighscore();
  }

  private addSounds() {
    sound.add("wing", "./sounds/sfx_wing.wav");
    sound.find("wing").volume = 0.2;

    sound.add("point", "./sounds/sfx_point.wav");
    sound.find("point").volume = 0.2;

    sound.add("hit", "./sounds/sfx_hit.wav");
    sound.find("hit").volume = 0.4;
  }

  public startGame() {
    this.gameRunning = true;
    this._app.stage.removeChild(this._texts.startInfo);
    this._app.stage.removeChild(this._texts.pauseInfo);
    this._app.stage.removeChild(this._texts.restartInfo);
  }

  private playHitSound() {
    if (!this.hitSound) {
      sound.play("hit");
      this.hitSound = true;
    }
  }

  public gameLoop(): void {
    if (
      this.gameRunning &&
      !collideWithBoundaries(this) &&
      !collideWithObstacles(this)
    ) {
      this.score = this._gameWorld.countObstacles();
      this._texts.displayFps();
      this._texts.displayScore();
      this._player.movePlayer();
      this._gameWorld.getObstacles(this._gameWorld.obstacleTexture);
      this._gameWorld.gameWorldSpeedProgression();
      this._player.bird.play();
      this._gameWorld.obstaclesArr.forEach((obs) => {
        this._gameWorld.obstacleSpeedProgression(obs);
      });
    } else if (
      !this.gameRunning &&
      (collideWithBoundaries(this) || collideWithObstacles(this))
    ) {
      this.playHitSound();
      this._player.bird.stop();
      this._texts.setHighscore();
      this._texts.displayHighscore();
      this._app.ticker.stop();
    }
  }
}

const game = new Game();
game.init();

window.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    game.gameRunning &&
    game._gameWorld.obstaclesArr.length > 2
  ) {
    game.keylock = true;
    game.gameRunning = false;
    game._player.bird.stop();
    game._app.ticker.stop();
  } else if (
    e.key === "Escape" &&
    !game.gameRunning &&
    game._gameWorld.obstaclesArr.length > 2
  ) {
    game.keylock = false;
    game.gameRunning = true;
    game._player.bird.play();
    game._app.ticker.start();
  }

  if (!game.tickerAdded) {
    window.addEventListener("keydown", (e) => {
      if (
        e.key === " " &&
        !game.gameRunning &&
        !game.tickerAdded &&
        !game.keylock
      ) {
        game.startGame();
        game._app.ticker.add(game.gameLoop.bind(game));
        game.tickerAdded = true;
      }
    });
  } else if (game.tickerAdded) {
    window.addEventListener("keydown", (e) => {
      if (
        e.key === " " &&
        !game.gameRunning &&
        game.tickerAdded &&
        !game.keylock
      ) {
        game.startGame();
      }
    });
  }

  if (e.key === "Enter" && !game.keylock) {
    game._app.ticker.start();
    game.gameRunning = false;
    game.score = 0;
    game._texts.displayScore();
    game._player.resetPlayer();
    game._gameWorld.resetGameWorld();
    game._app.stage.addChild(game._texts.startInfo);
    game._app.stage.addChild(game._texts.pauseInfo);
    game._app.stage.addChild(game._texts.restartInfo);
    game.hitSound = false;
  }
});
