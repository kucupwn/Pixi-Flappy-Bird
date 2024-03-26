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

// function generateObstacleUpper(
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

// function generateObstacleLower(
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
//   let obstacleUpper = generateObstacleUpper(
//     app,
//     bordersHeight,
//     obstacleHeights
//   );
//   app.stage.addChild(obstacleUpper);
//   obstaclesArr.push(obstacleUpper);
//   let obstacleLower = generateObstacleLower(
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
  app: PIXI.Application;
  player: PIXI.Graphics;
  ceil: PIXI.Graphics;
  floor: PIXI.Graphics;
  keys: { [key: string]: boolean } = {};
  gameRunning: boolean = false;
  obstacleInterval?: ReturnType<typeof setTimeout>;
  obstaclesArr: PIXI.Graphics[] = [];

  constructor() {
    this.app = new PIXI.Application();
    this.player = new PIXI.Graphics().circle(0, 0, 30).fill("green");
    this.ceil = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
    this.floor = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
  }

  public async init() {
    await this.app.init({ antialias: true, width: 700, height: 500 });
    document.body.appendChild(this.app.canvas);
    this.setup();
  }

  public setup() {
    this.addPlayer();
    this.addBoundaries();

    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));

    this.app.ticker.add(this.gameLoop.bind(this));
  }

  private addPlayer(): void {
    this.player.x = 200;
    this.player.y = this.app.canvas.height / 2;
    this.player.pivot.set(0.5);
    this.app.stage.addChild(this.player);
  }

  private addBoundaries() {
    this.ceil.width = this.app.canvas.width;
    this.app.stage.addChild(this.ceil);

    this.floor.width = this.app.canvas.width;
    this.floor.y = this.app.canvas.height - this.floor.height;
    this.app.stage.addChild(this.floor);
  }

  private keyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  private keyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  private startGame(): void {
    if (this.keys[" "]) {
      this.gameRunning = true;
    } else if (this.keys["Escape"]) {
      this.gameRunning = false;
    }
  }

  private movePlayer(): void {
    if (this.keys[" "]) {
      this.player.y -= 5;
    } else {
      this.player.y += 5;
    }
  }

  private collideWithBoundaries(): boolean {
    const playerTop = this.player.y - this.player.height / 2;
    const playerBottom = this.player.y + this.player.height / 2;
    const ceilBottom = this.ceil.y + this.ceil.height;
    const floorTop = this.floor.y;

    return playerTop <= ceilBottom || playerBottom >= floorTop;
  }

  private collideWithObstacles(): boolean {
    for (const obstacle of this.obstaclesArr) {
      const playerLeft = this.player.x - this.player.width / 2;
      const playerRight = this.player.x + this.player.width / 2;
      const playerTop = this.player.y - this.player.height / 2;
      const playerBottom = this.player.y + this.player.height / 2;

      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = obstacle.y;
      const obstacleBottom = obstacle.y + obstacle.height;

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

  private getRandomHeights(): number[] {
    const obstacleSumHeight = this.app.canvas.height - 200;
    const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight);
    const randomHeight2 = obstacleSumHeight - randomHeight1;

    return [randomHeight1, randomHeight2];
  }

  private generateObstacleUpper(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleUpper = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");
    obstacleUpper.height = obstacleHeights[0];
    obstacleUpper.x = this.app.canvas.width;
    obstacleUpper.y += (this.ceil.height + this.floor.height) / 2;

    return obstacleUpper;
  }

  private generateObstacleLower(obstacleHeights: number[]): PIXI.Graphics {
    const obstacleLower = new PIXI.Graphics().rect(0, 0, 30, 20).fill("red");

    obstacleLower.height = obstacleHeights[1];
    obstacleLower.x = this.app.canvas.width;
    obstacleLower.y =
      this.app.canvas.height -
      obstacleLower.height -
      (this.ceil.height + this.floor.height) / 2;

    return obstacleLower;
  }

  private getObstacles(): void {
    const obstacleHeights = this.getRandomHeights();

    let obstacleUpper = this.generateObstacleUpper(obstacleHeights);
    this.app.stage.addChild(obstacleUpper);
    this.obstaclesArr.push(obstacleUpper);

    let obstacleLower = this.generateObstacleLower(obstacleHeights);
    this.app.stage.addChild(obstacleLower);
    this.obstaclesArr.push(obstacleLower);
  }

  private gameLoop(): void {
    this.startGame();
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

const resetBtn = document.getElementById("reset-btn") as HTMLElement;

resetBtn.addEventListener("click", () => {
  location.reload();
});
