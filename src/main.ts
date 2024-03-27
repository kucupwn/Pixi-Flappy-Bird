import * as PIXI from "pixi.js";
import { Player } from "./player";
import { GameWorld } from "./gameWorld";

export class Game {
  _app: PIXI.Application;
  _player: Player;
  _gameWorld: GameWorld;
  gameRunning: boolean = false;
  obstacleInterval?: ReturnType<typeof setTimeout>;
  obstaclesArr: PIXI.Graphics[] = [];

  constructor() {
    this._app = new PIXI.Application();
    this._player = new Player();
    this._gameWorld = new GameWorld(this);
    this.init();
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    document.body.appendChild(this._app.canvas);
    this.addPlayer();
    this.addBoundaries();

    window.addEventListener("keydown", (e) => {
      if (e.key === " " && !this.gameRunning) {
        this._app.ticker.add(this.gameLoop.bind(this));
      }
    });
  }

  private setGameStatus(): void {
    if (this._player.keys[" "]) {
      this.gameRunning = true;
    } else if (this._player.keys["Escape"]) {
      this.gameRunning = false;
    }
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

  private collideWithBoundaries(): boolean {
    const playerTop = this._player.graphics.getBounds().minY;
    const playerBottom = this._player.graphics.getBounds().maxY;
    const ceilBottom = this._gameWorld.ceil.getBounds().maxY;
    const floorTop = this._gameWorld.floor.getBounds().minY;

    return playerTop <= ceilBottom || playerBottom >= floorTop;
  }

  private collideWithObstacles(): boolean {
    for (const obstacle of this.obstaclesArr) {
      const playerLeft = this._player.graphics.getBounds().minX;
      const playerRight = this._player.graphics.getBounds().maxX;
      const playerTop = this._player.graphics.getBounds().minY;
      const playerBottom = this._player.graphics.getBounds().maxY;

      const obstacleLeft = obstacle.getBounds().minX;
      const obstacleRight = obstacle.getBounds().maxX;
      const obstacleTop = obstacle.getBounds().minY;
      const obstacleBottom = obstacle.getBounds().maxY;

      if (
        playerRight >= obstacleLeft &&
        playerLeft <= obstacleRight &&
        playerBottom >= obstacleTop &&
        playerTop <= obstacleBottom
      ) {
        this.gameRunning = false;
        return true;
      }
    }

    return false;
  }

  private gameLoop(): void {
    this.setGameStatus();
    console.log(this.obstaclesArr);
    if (
      this.gameRunning &&
      !this.collideWithBoundaries() &&
      !this.collideWithObstacles()
    ) {
      this._player.movePlayer();
      this.obstaclesArr.forEach((obs) => {
        obs.x -= 5;
      });
    }

    if (!this.obstacleInterval && this.gameRunning) {
      this.obstacleInterval = setInterval(() => {
        this._gameWorld.getObstacles();
      }, 1000);
    } else if (this.obstacleInterval && !this.gameRunning) {
      clearInterval(this.obstacleInterval);
      this._app.ticker.stop();
    }
  }
}

const game = new Game();
