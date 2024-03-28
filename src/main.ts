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
  obstaclesArr: PIXI.Graphics[] = [];

  constructor() {
    this._app = new PIXI.Application();
    this._player = new Player();
    this._gameWorld = new GameWorld(this);
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    appContainer!.appendChild(this._app.canvas);
    this.gameStatus();
    this.addPlayer();
    this.addBoundaries();
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

  private addPlayer(): void {
    this._player.graphics.x = this._app.canvas.width * 0.3;
    this._player.graphics.y = this._app.canvas.height / 2;
    this._app.stage.addChild(this._player.graphics);
  }

  private addBoundaries(): void {
    this._gameWorld.ceil.width = this._app.canvas.width;
    this._app.stage.addChild(this._gameWorld.ceil);

    this._gameWorld.floor.width = this._app.canvas.width;
    this._gameWorld.floor.y =
      this._app.canvas.height - this._gameWorld.floor.height;
    this._app.stage.addChild(this._gameWorld.floor);
  }

  public gameLoop(): void {
    if (
      this.gameRunning &&
      !collideWithBoundaries(this) &&
      !collideWithObstacles(this)
    ) {
      this._player.movePlayer();
      this.obstaclesArr.forEach((obs) => {
        obs.x -= 5;
      });
    }

    if (this.gameRunning) {
      this._gameWorld.getObstacles();
    } else if (!this.gameRunning) {
      this._app.ticker.stop();
    }
  }
}

const game = new Game();
game.init();
