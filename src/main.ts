import * as PIXI from "pixi.js";

class Player {
  graphics: PIXI.Graphics;
  keys: { [key: string]: boolean } = {};

  constructor() {
    this.graphics = new PIXI.Graphics().circle(0, 0, 30).fill("green");
    this.eventListener();
  }

  private eventListener(): void {
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

  private keyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  private keyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  public movePlayer(): void {
    if (this.keys[" "]) {
      this.graphics.y -= 5;
    } else {
      this.graphics.y += 5;
    }
  }
}

class GameWorld {
  _app: PIXI.Application;
  ceil: PIXI.Graphics;
  floor: PIXI.Graphics;

  constructor(app: PIXI.Application) {
    this._app = app;
    this.ceil = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
    this.floor = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
  }

  private getRandomHeights(): number[] {
    const obstacleSumHeight = game._app.canvas.height - 200;
    const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight);
    const randomHeight2 = obstacleSumHeight - randomHeight1;

    return [randomHeight1, randomHeight2];
  }

  private getObstacleUpper(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleUpper = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");
    obstacleUpper.height = obstacleHeights[0];
    obstacleUpper.x = game._app.canvas.width;
    obstacleUpper.y += this.ceil.height;

    return obstacleUpper;
  }

  private getObstacleLower(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleLower = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");

    obstacleLower.height = obstacleHeights[1];
    obstacleLower.x = game._app.canvas.width;
    obstacleLower.y =
      game._app.canvas.height - obstacleLower.height - this.floor.height;

    return obstacleLower;
  }

  public getObstacles(): void {
    const obstacleHeights = this.getRandomHeights();

    let obstacleUpper = this.getObstacleUpper(obstacleHeights);
    game._app.stage.addChild(obstacleUpper);
    game.obstaclesArr.push(obstacleUpper);

    let obstacleLower = this.getObstacleLower(obstacleHeights);
    game._app.stage.addChild(obstacleLower);
    game.obstaclesArr.push(obstacleLower);
  }
}

class Game {
  _app: PIXI.Application;
  _player: Player;
  _gameWorld: GameWorld;
  gameRunning: boolean = false;
  obstacleInterval?: ReturnType<typeof setTimeout>;
  obstaclesArr: PIXI.Graphics[] = [];

  constructor(player: Player, gameWorld: GameWorld) {
    this._app = new PIXI.Application();
    this._player = player;
    this._gameWorld = gameWorld;
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    document.body.appendChild(this._app.canvas);
    this.setup();
  }

  private setup() {
    this.addPlayer();
    this.addBoundaries();

    this._app.ticker.add(this.gameLoop.bind(this));
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

  private addBoundaries() {
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
        return true;
      }
    }

    return false;
  }

  private gameLoop(): void {
    this.setGameStatus();
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
        gameWorld.getObstacles();
      }, 1000);
    } else if (this.obstacleInterval && !this.gameRunning) {
      clearInterval(this.obstacleInterval);
    }
  }
}

const player = new Player();
const gameWorld = new GameWorld(new PIXI.Application());
const game = new Game(player, gameWorld);
game.init();
