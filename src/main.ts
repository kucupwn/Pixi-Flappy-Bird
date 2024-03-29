import * as PIXI from "pixi.js";
import { Player } from "./player";
import { GameWorld } from "./gameWorld";
import { collideWithBoundaries, collideWithObstacles } from "./collisionCheck";

const appContainer = document.getElementById("app");

export class Game {
  _app: PIXI.Application;
  _player: Player;
  _gameWorld: GameWorld;
  gameRunning: boolean = false;
  tickerAdded: boolean = false;
  startInfo: PIXI.Text;
  pauseInfo: PIXI.Text;
  restartInfo: PIXI.Text;
  scoreLabel: PIXI.Text;
  highscoreLabel: PIXI.Text;
  score: number = 0;
  highScore: number = 0;

  constructor() {
    this._app = new PIXI.Application();
    this._player = new Player(this);
    this._gameWorld = new GameWorld(this);
    this.scoreLabel = new PIXI.Text({ text: "", style: { fill: "black" } });
    this.highscoreLabel = new PIXI.Text({ text: "", style: { fill: "black" } });
    this.startInfo = new PIXI.Text({
      text: "Press 'Space' to start!",
      style: { fill: "black" },
    });
    this.pauseInfo = new PIXI.Text({
      text: "Press 'Escape' to pause/unpause!",
      style: { fill: "black" },
    });
    this.restartInfo = new PIXI.Text({
      text: "Press 'Enter' to restart!",
      style: { fill: "black" },
    });
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    appContainer?.appendChild(this._app.canvas);
    await this._gameWorld.initGameWorldSprites();
    await this._player.initBirdSprite();

    this.control();
    this.gameStatus();
    this.displayScore();
    this.displayHighscore();
  }

  private startGame() {
    this.gameRunning = true;
    this._app.stage.removeChild(this.startInfo);
    this._app.stage.removeChild(this.pauseInfo);
    this._app.stage.removeChild(this.restartInfo);
  }

  private gameStatus() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.gameRunning) {
        this.gameRunning = false;
        this._app.ticker.stop();
      } else if (e.key === "Escape" && !this.gameRunning) {
        this.gameRunning = true;
        this._app.ticker.start();
      }
    });

    if (!this.tickerAdded) {
      window.addEventListener("keydown", (e) => {
        if (e.key === " " && !this.gameRunning && !this.tickerAdded) {
          this.startGame();
          this._app.ticker.add(this.gameLoop.bind(this));
          this.tickerAdded = true;
        }
      });
    } else if (this.tickerAdded) {
      window.addEventListener("keydown", (e) => {
        if (e.key === " " && !this.gameRunning && this.tickerAdded) {
          this.startGame();
        }
      });
    }
  }

  private control() {
    this._app.stage.addChild(this.startInfo);
    this.startInfo.anchor.set(0.5);
    this.startInfo.x = this._app.canvas.width / 2;
    this.startInfo.y = this._app.canvas.height * 0.2;

    this._app.stage.addChild(this.pauseInfo);
    this.pauseInfo.anchor.set(0.5);
    this.pauseInfo.x = this._app.canvas.width / 2;
    this.pauseInfo.y = this._app.canvas.height * 0.3;

    this._app.stage.addChild(this.restartInfo);
    this.restartInfo.anchor.set(0.5);
    this.restartInfo.x = this._app.canvas.width / 2;
    this.restartInfo.y = this._app.canvas.height * 0.4;
  }

  public displayScore() {
    this._app.stage.addChild(this.scoreLabel);
    this.scoreLabel.y = this._app.canvas.height * 0.94;
    this.scoreLabel.zIndex = 1;
    this.scoreLabel.text = `Score: ${this._gameWorld.countObstacles()}`;
  }

  private displayHighscore() {
    this._app.stage.addChild(this.highscoreLabel);
    this.highscoreLabel.y = this._app.canvas.height * 0.94;
    this.highscoreLabel.x = this._app.canvas.width * 0.75;
    this.highscoreLabel.zIndex = 1;
    this.highscoreLabel.text = `Highscore: ${this.highScore}`;
  }

  private setHighscore() {
    if (this.score > this.highScore) {
      this.highScore = this.score / 2;
    }
  }

  private resetGame() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.gameRunning = false;
        this.score = 0;
        this.displayScore();
        this._player.resetPlayer();
        this._gameWorld.resetGameWorld();
        this._app.stage.addChild(this.startInfo);
        this._app.stage.addChild(this.pauseInfo);
        this._app.stage.addChild(this.restartInfo);
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
      this.displayScore();
      this._player.movePlayer();
      this._gameWorld.animateWorld();
      this._gameWorld.getObstacles(this._gameWorld.obstacleTexture);
      this._gameWorld.obstaclesArr.forEach((obs) => {
        obs.x -= 5;
      });
    } else if (
      !this.gameRunning &&
      (collideWithBoundaries(this) || collideWithObstacles(this))
    ) {
      this.setHighscore();
      this.displayHighscore();
      this.resetGame();
    }
  }
}

const game = new Game();
game.init();
