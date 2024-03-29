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
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    appContainer?.appendChild(this._app.canvas);
    await this._gameWorld.initGameWorldSprites();
    await this._player.initBirdSprite();

    this.gameStatus();
    this.displayScore();
    this.displayHighscore();
  }

  private gameStatus() {
    window.addEventListener("keydown", (e) => {
      if (e.key === " " && !this.gameRunning) {
        this.gameRunning = true;
        this._app.ticker.add(this.gameLoop.bind(this));
      } else if (e.key === "Escape" && this.gameRunning) {
        this.gameRunning = false;
        this._app.ticker.stop();
      } else if (e.key === "Escape" && !this.gameRunning) {
        this.gameRunning = true;
        this._app.ticker.start();
      }
    });
  }

  public displayScore() {
    this._app.stage.addChild(this.scoreLabel);
    this.scoreLabel.y = this._app.canvas.height * 0.94;
    // this.scoreLabel.x = this._app.canvas.width / 2;
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

  public gameLoop(): void {
    if (
      this.gameRunning &&
      !collideWithBoundaries(this) &&
      !collideWithObstacles(this)
    ) {
      console.log(game._gameWorld.obstaclesArr);
      this.displayScore();
      this._player.movePlayer();
      this._gameWorld.animateWorld();
      this._gameWorld.getObstacles(this._gameWorld.obstacleTexture);
      this._gameWorld.obstaclesArr.forEach((obs) => {
        obs.x -= 5;
      });
    } else if (!this.gameRunning) {
      this.setHighscore();
      this.displayHighscore();
      this._app.ticker.stop();
    }
  }
}

const game = new Game();
game.init();
