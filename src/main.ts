import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { GameWorld } from "./gameWorld";
import { Player } from "./player";
import { Texts } from "./texts";
import {
  getObstacles,
  playPointSound,
  countObstacles,
  setObstacleDistance,
  setGameWorldSpeed,
  setObstacleSpeed,
} from "./obstaclesFunctions";
import { collideWithBoundaries, collideWithObstacles } from "./collisionCheck";

const appContainer = document.getElementById("app");
const gameTitleText = document.getElementById("game-title-text");
const gameModeText = document.getElementById("game-mode-text");
const normalModeBtn = document.getElementById("normal-mode");
const rapidModeBtn = document.getElementById("rapid-mode");

export class Game {
  _app: PIXI.Application;
  _player: Player;
  _gameWorld: GameWorld;
  _texts: Texts;
  gameRunning: boolean = false;
  gameEnded: boolean = false;
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

  // Initialize assets and UI
  public async init() {
    await this._gameWorld.initGameWorldSprites();
    await this._player.initBirdSprite();
    await this._texts.initFont();

    this.addSounds();
    this._texts.initFps();
    this._texts.userControlInfo();
    this._texts.displayScore();
    this._texts.displayHighscore();
  }

  // Initialize normal game mode
  public async normalMode() {
    await this._app.init({ antialias: true, width: 700, height: 540 });
    appContainer?.appendChild(this._app.canvas);
    await this.init();

    this._gameWorld.animationSpeed = 3;
    this._gameWorld.obstacleDistance = 300;
  }

  // Initialize rapid game mode
  public async rapidMode() {
    await this._app.init({ antialias: true, width: 960, height: 540 });
    appContainer?.appendChild(this._app.canvas);
    await this.init();

    this._gameWorld.animationSpeed = 6;
    this._gameWorld.obstacleDistance = 350;
  }

  // Add game sounds to pixi sound
  private addSounds() {
    sound.add("music", "./assets/Sounds/music.mp3");
    sound.find("music").volume = 0.1;
    sound.find("music").loop = true;

    sound.add("wing", "./assets/Sounds/sfx_wing.wav");
    sound.find("wing").volume = 0.2;

    sound.add("point", "./assets/Sounds/sfx_point.wav");
    sound.find("point").volume = 0.1;

    sound.add("hit", "./assets/Sounds/sfx_hit.wav");
    sound.find("hit").volume = 0.3;
  }

  // Start run, remove user instructions
  public startGame() {
    sound.play("music");
    this.gameRunning = true;
    this._app.stage.removeChild(this._texts.startInfo);
    this._app.stage.removeChild(this._texts.pauseInfo);
    this._app.stage.removeChild(this._texts.restartInfo);
    this._app.stage.removeChild(this._texts.gameModeInfo);
  }

  // Play hit sound (game end)
  private playHitSound() {
    if (!this.hitSound) {
      sound.play("hit");
      this.hitSound = true;
    }
  }

  // This is the game
  public gameLoop(): void {
    if (
      this.gameRunning &&
      !collideWithBoundaries(this) &&
      !collideWithObstacles(this)
    ) {
      this.score = countObstacles(this);
      this._texts.displayFps();
      this._texts.displayScore();
      this._player.movePlayer();
      this._player.bird.play();
      playPointSound(this);
      setObstacleDistance(this);
      getObstacles(this, this._gameWorld.obstacleTexture);
      setGameWorldSpeed(this);
      this._gameWorld.obstaclesArr.forEach((obs) => {
        setObstacleSpeed(this, obs);
      });
    } else if (
      !this.gameRunning &&
      (collideWithBoundaries(this) || collideWithObstacles(this))
    ) {
      sound.stop("music");
      this.playHitSound();
      this._player.bird.stop();
      this._texts.setHighscore();
      this._texts.displayHighscore();
      this._app.ticker.stop();
    }
  }
}

const game = new Game();

// Event listeners for game mode choice
normalModeBtn?.addEventListener("click", () => {
  game.normalMode();
  gameTitleText?.remove();
  gameModeText?.remove();
  normalModeBtn.remove();
  rapidModeBtn?.remove();
});

rapidModeBtn?.addEventListener("click", () => {
  game.rapidMode();
  gameTitleText?.remove();
  gameModeText?.remove();
  rapidModeBtn.remove();
  normalModeBtn?.remove();
});

// Event listener for control game status
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
        !game.keylock &&
        !game.gameEnded
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
        !game.keylock &&
        !game.gameEnded
      ) {
        game.startGame();
      }
    });
  }

  if (
    e.key === "Enter" &&
    !game.keylock &&
    !game.gameRunning &&
    (collideWithBoundaries(game) || collideWithObstacles(game))
  ) {
    game._app.ticker.start();
    game.gameEnded = false;
    game.gameRunning = false;
    game.score = 0;
    game._texts.displayScore();
    game._player.resetPlayer();
    game._gameWorld.resetGameWorld();
    game._app.stage.addChild(game._texts.startInfo);
    game._app.stage.addChild(game._texts.pauseInfo);
    game._app.stage.addChild(game._texts.restartInfo);
    game._app.stage.addChild(game._texts.gameModeInfo);

    game.hitSound = false;
  }
});
