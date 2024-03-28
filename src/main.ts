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
    this._player = new Player(this);
    this._gameWorld = new GameWorld(this);
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    appContainer?.appendChild(this._app.canvas);
    await this._gameWorld.loadSprites();

    this.gameStatus();
    this._player.addPlayer();
    // this._gameWorld.addBoundaries();
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

  public gameLoop(): void {
    if (
      this.gameRunning &&
      !collideWithBoundaries(this) &&
      !collideWithObstacles(this)
    ) {
      this._player.movePlayer();
      // this._gameWorld.getObstacles();
      this._gameWorld.animateWorld();
      this.obstaclesArr.forEach((obs) => {
        obs.x -= 5;
      });
    } else if (!this.gameRunning) {
      this._app.ticker.stop();
    }
  }
}

const game = new Game();
game.init();
