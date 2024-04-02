import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { GameWorld } from "./gameWorld";
import { Player } from "./player";
import { Texts } from "./texts";
import { GameStatusEvents } from "./gameStatusEvents";
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
  gameStatusEvents: GameStatusEvents;
  tickerAdded: boolean = false;
  gameRunning: boolean = false;
  keylock: boolean = false;
  gameEnded: boolean = false;
  hitSound: boolean = false;
  score: number = 0;
  highScore: number = 0;

  constructor() {
    this._app = new PIXI.Application();
    this._player = new Player(this);
    this._gameWorld = new GameWorld(this);
    this._texts = new Texts(this);
    this.gameStatusEvents = new GameStatusEvents(this);
  }

  // Initialize assets and UI
  public async init(): Promise<void> {
    await this._gameWorld.initGameWorldSprites();
    await this._player.initBirdSprite();
    await this._texts.initFont();

    this.addSounds();
    this._texts.initFps();
    this._texts.userControlInfo();
    this._texts.displayScore();
    this._texts.displayHighscore();
    this.gameStatusEvents.eventListener(this);
  }

  // Initialize normal game mode
  public async normalMode(): Promise<void> {
    await this._app.init({ antialias: true, width: 700, height: 540 });
    appContainer?.appendChild(this._app.canvas);
    await this.init();

    this._gameWorld.animationSpeed = 3;
    this._gameWorld.backgroundSpeed = 0.1;
    this._gameWorld.obstacleDistance = 250;
  }

  // Initialize rapid game mode
  public async rapidMode(): Promise<void> {
    await this._app.init({ antialias: true, width: 960, height: 540 });
    appContainer?.appendChild(this._app.canvas);
    await this.init();

    this._gameWorld.animationSpeed = 6;
    this._gameWorld.backgroundSpeed = 0.4;
    this._gameWorld.obstacleDistance = 350;
  }

  // Add game sounds to pixi sound
  private addSounds(): void {
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
  public startGame(): void {
    sound.play("music");
    this.gameRunning = true;
    this._app.stage.removeChild(this._texts.startInfo);
    this._app.stage.removeChild(this._texts.pauseInfo);
    this._app.stage.removeChild(this._texts.restartInfo);
    this._app.stage.removeChild(this._texts.gameModeInfo);
  }

  // Play hit sound (game end)
  private playHitSound(): void {
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
      setGameWorldSpeed(this, this._gameWorld.animationLevel);
      this._gameWorld.obstaclesArr.forEach((obs) => {
        setObstacleSpeed(this, obs, this._gameWorld.animationLevel);
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
