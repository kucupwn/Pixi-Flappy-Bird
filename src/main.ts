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

class Game {
  _app: PIXI.Application;
  _player: Player;
  _ceil: PIXI.Graphics;
  _floor: PIXI.Graphics;
  gameRunning: boolean = false;
  obstacleInterval?: ReturnType<typeof setTimeout>;
  obstaclesArr: PIXI.Graphics[] = [];

  constructor(player: Player) {
    this._app = new PIXI.Application();
    this._player = player;
    this._ceil = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
    this._floor = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
  }

  public async init() {
    await this._app.init({ antialias: true, width: 700, height: 500 });
    document.body.appendChild(this._app.canvas);
    this.setup();
  }

  public setup() {
    this.addPlayer();
    this.addBoundaries();
    console.log(this._player);

    this._app.ticker.add(this.gameLoop.bind(this));
  }

  protected setGameStatus(): void {
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
    this._ceil.width = this._app.canvas.width;
    this._app.stage.addChild(this._ceil);

    this._floor.width = this._app.canvas.width;
    this._floor.y = this._app.canvas.height - this._floor.height;
    this._app.stage.addChild(this._floor);
  }

  private getRandomHeights(): number[] {
    const obstacleSumHeight = this._app.canvas.height - 200;
    const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight);
    const randomHeight2 = obstacleSumHeight - randomHeight1;

    return [randomHeight1, randomHeight2];
  }

  private getObstacleUpper(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleUpper = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");
    obstacleUpper.height = obstacleHeights[0];
    obstacleUpper.x = this._app.canvas.width;
    obstacleUpper.y += this._ceil.height;

    return obstacleUpper;
  }

  private getObstacleLower(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleLower = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");

    obstacleLower.height = obstacleHeights[1];
    obstacleLower.x = this._app.canvas.width;
    obstacleLower.y =
      this._app.canvas.height - obstacleLower.height - this._floor.height;

    return obstacleLower;
  }

  private getObstacles(): void {
    const obstacleHeights = this.getRandomHeights();

    let obstacleUpper = this.getObstacleUpper(obstacleHeights);
    this._app.stage.addChild(obstacleUpper);
    this.obstaclesArr.push(obstacleUpper);

    let obstacleLower = this.getObstacleLower(obstacleHeights);
    this._app.stage.addChild(obstacleLower);
    this.obstaclesArr.push(obstacleLower);
  }

  private collideWithBoundaries(): boolean {
    const playerTop = this._player.graphics.getBounds().minY;
    const playerBottom = this._player.graphics.getBounds().maxY;
    const ceilBottom = this._ceil.getBounds().maxY;
    const floorTop = this._floor.getBounds().minY;

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
        this.getObstacles();
      }, 1000);
    } else if (this.obstacleInterval && !this.gameRunning) {
      clearInterval(this.obstacleInterval);
    }
  }
}

const player = new Player();
const game = new Game(player);
game.init();
