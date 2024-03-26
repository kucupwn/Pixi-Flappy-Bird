import * as PIXI from "pixi.js";

// function keyDown(e: KeyboardEvent): void {
//   keys[e.key] = true;
// }

// function keyUp(e: KeyboardEvent): void {
//   keys[e.key] = false;
// }

// function startGame(): void {
//   if (keys[" "]) {
//     gameRunning = true;
//   } else if (keys["Escape"]) {
//     gameRunning = false;
//   }
// }

// function movePlayer(player: PIXI.Graphics): void {
//   if (keys[" "]) {
//     player.y -= 5;
//   } else {
//     player.y += 5;
//   }
// }

// function collideWithBoundaries(
//   player: PIXI.Graphics,
//   ceil: PIXI.Graphics,
//   floor: PIXI.Graphics
// ): boolean {
//   const playerTop = player.y - player.height / 2;
//   const playerBottom = player.y + player.height / 2;

//   const ceilBottom = ceil.y + ceil.height;
//   const floorTop = floor.y;

//   if (playerTop <= ceilBottom || playerBottom >= floorTop) {
//     return true;
//   } else return false;
// }

// function collideWithObstacles(
//   player: PIXI.Graphics,
//   obstaclesArr: PIXI.Graphics[]
// ): boolean {
//   for (const obstacle of obstaclesArr) {
//     console.log(obstacle.getBounds());
//     console.log(player.getBounds());
//     const playerLeft = player.x - player.width / 2;
//     const playerRight = player.x + player.width / 2;
//     const playerTop = player.y - player.height / 2;
//     const playerBottom = player.y + player.height / 2;

//     const obstacleLeft = obstacle.x;
//     const obstacleRight = obstacle.x + obstacle.width;
//     const obstacleTop = obstacle.y;
//     const obstacleBottom = obstacle.y + obstacle.height;

//     if (
//       playerRight > obstacleLeft &&
//       playerLeft < obstacleRight &&
//       playerBottom > obstacleTop &&
//       playerTop < obstacleBottom
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// function getRandomHeights(app: PIXI.Application): number[] {
//   const obstacleSumHeight = app.canvas.height - 250;
//   const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight + 1);
//   const randomHeight2 = obstacleSumHeight - randomHeight1;

//   return [randomHeight1, randomHeight2];
// }

// function getObstacleUpper(
//   app: PIXI.Application,
//   bordersHeight: number,
//   obstacleHeights: number[]
// ): PIXI.Graphics {
//   const obstacleUpper = new PIXI.Graphics().rect(0, 0, 30, 20).fill("pink");
//   obstacleUpper.height = obstacleHeights[0];
//   obstacleUpper.x = app.canvas.width;
//   obstacleUpper.y += bordersHeight / 2;

//   return obstacleUpper;
// }

// function getObstacleLower(
//   app: PIXI.Application,
//   bordersHeight: number,
//   obstacleHeights: number[]
// ): PIXI.Graphics {
//   const obstacleLower = new PIXI.Graphics().rect(0, 0, 30, 20).fill("pink");
//   obstacleLower.height = obstacleHeights[1];
//   obstacleLower.x = app.canvas.width;
//   obstacleLower.y =
//     app.canvas.height - obstacleLower.height - bordersHeight / 2;

//   return obstacleLower;
// }

// function getObstacles(
//   app: PIXI.Application,
//   bordersHeight: number,
//   obstacleHeights: number[]
// ): void {
//   let obstacleUpper = getObstacleUpper(
//     app,
//     bordersHeight,
//     obstacleHeights
//   );
//   app.stage.addChild(obstacleUpper);
//   obstaclesArr.push(obstacleUpper);
//   let obstacleLower = getObstacleLower(
//     app,
//     bordersHeight,
//     obstacleHeights
//   );
//   app.stage.addChild(obstacleLower);
//   obstaclesArr.push(obstacleLower);
// }

// let keys: { [key: string]: boolean } = {};
// let gameRunning = false;
// let obstacleInterval: ReturnType<typeof setTimeout>;
// const obstaclesArr: PIXI.Graphics[] = [];

// (async () => {
//   const app = new PIXI.Application();
//   await app.init({ antialias: true, width: 700, height: 500 });
//   document.body.appendChild(app.canvas);

//   const player = new PIXI.Graphics().circle(0, 0, 30).fill("green");
//   player.x = 200;
//   player.y = app.canvas.height / 2;
//   player.pivot.set(0.5);
//   app.stage.addChild(player);

//   const ceil = new PIXI.Graphics().rect(0, 0, app.canvas.width, 20).fill("red");
//   app.stage.addChild(ceil);

//   const floor = new PIXI.Graphics()
//     .rect(0, 0, app.canvas.width, 20)
//     .fill("red");
//   floor.y = app.canvas.height - floor.height;
//   app.stage.addChild(floor);

//   const bordersHeight = ceil.height + floor.height;

//   window.addEventListener("keydown", keyDown);
//   window.addEventListener("keyup", keyUp);

//   app.ticker.add(() => {
//     startGame();
//     if (gameRunning) {
//       if (
//         !collideWithBoundaries(player, ceil, floor) &&
//         !collideWithObstacles(player, obstaclesArr)
//       ) {
//         movePlayer(player);
//         obstaclesArr.forEach((obs) => {
//           obs.x -= 5;
//         });
//       }
//     }

//     if (!obstacleInterval && gameRunning) {
//       obstacleInterval = setInterval(() => {
//         const obstacleHeights = getRandomHeights(app);
//         getObstacles(app, bordersHeight, obstacleHeights);
//       }, 1000);
//     } else if (obstacleInterval && !gameRunning) {
//       clearInterval(obstacleInterval);
//     }
//   });
// })();

class Game {
  _app: PIXI.Application;
  _player: PIXI.Graphics;
  _ceil: PIXI.Graphics;
  _floor: PIXI.Graphics;
  keys: { [key: string]: boolean } = {};
  gameRunning: boolean = false;
  obstacleInterval?: ReturnType<typeof setTimeout>;
  obstaclesArr: PIXI.Graphics[] = [];

  constructor() {
    this._app = new PIXI.Application();
    this._player = new PIXI.Graphics().circle(0, 0, 30).fill("green");
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

    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));

    this._app.ticker.add(this.gameLoop.bind(this));
  }

  private addPlayer(): void {
    this._player.x = this._app.canvas.width * 0.3;
    this._player.y = this._app.canvas.height / 2;
    this._app.stage.addChild(this._player);
  }

  private addBoundaries() {
    this._ceil.width = this._app.canvas.width;
    this._app.stage.addChild(this._ceil);

    this._floor.width = this._app.canvas.width;
    this._floor.y = this._app.canvas.height - this._floor.height;
    this._app.stage.addChild(this._floor);
  }

  private keyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  private keyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  private setGameStatus(): void {
    if (this.keys[" "]) {
      this.gameRunning = true;
    } else if (this.keys["Escape"]) {
      this.gameRunning = false;
    }
  }

  private movePlayer(): void {
    if (this.keys[" "]) {
      this._player.y -= 5;
    } else {
      this._player.y += 5;
    }
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
    const playerTop = this._player.getBounds().minY;
    const playerBottom = this._player.getBounds().maxY;
    const ceilBottom = this._ceil.getBounds().maxY;
    const floorTop = this._floor.getBounds().minY;

    return playerTop <= ceilBottom || playerBottom >= floorTop;
  }

  private collideWithObstacles(): boolean {
    for (const obstacle of this.obstaclesArr) {
      const playerLeft = this._player.getBounds().minX;
      const playerRight = this._player.getBounds().maxX;
      const playerTop = this._player.getBounds().minY;
      const playerBottom = this._player.getBounds().maxY;

      const obstacleLeft = obstacle.getBounds().minX;
      const obstacleRight = obstacle.getBounds().maxX;
      const obstacleTop = obstacle.getBounds().minY;
      const obstacleBottom = obstacle.getBounds().maxY;

      if (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerBottom > obstacleTop &&
        playerTop < obstacleBottom
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
      this.movePlayer();
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

const game = new Game();
game.init();
