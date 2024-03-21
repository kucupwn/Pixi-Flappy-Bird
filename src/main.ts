import * as PIXI from "pixi.js";

function keyDown(e: KeyboardEvent): void {
  console.log(e.key);
  keys[e.key] = true;
}

function keyUp(e: KeyboardEvent): void {
  keys[e.key] = false;
}

function startGame(): void {
  if (keys[" "]) {
    gameRunning = true;
  } else if (keys["Escape"]) {
    gameRunning = false;
  }
}

function movePlayer(player: PIXI.Graphics): void {
  if (keys[" "]) {
    player.y -= 5;
  } else {
    player.y += 5;
  }
}

function collide(
  player: PIXI.Graphics,
  ceil: PIXI.Graphics,
  floor: PIXI.Graphics
): boolean {
  const playerTop = player.y - player.height / 2;
  const playerBottom = player.y + player.height / 2;

  const ceilBottom = ceil.y + ceil.height;
  const floorTop = floor.y;

  if (playerTop <= ceilBottom || playerBottom >= floorTop) {
    return true;
  } else return false;
}

function getRandomHeights(
  app: PIXI.Application,
  bordersHeight: number
): number[] {
  const obstacleSumHeight = app.canvas.height - bordersHeight - 100;
  const randomHeight1 = Math.floor(Math.random() * obstacleSumHeight + 1);
  const randomHeight2 = obstacleSumHeight - randomHeight1;

  return [randomHeight1, randomHeight2];
}

function generateObstacleUpper(
  app: PIXI.Application,
  obstacleHeights: number[]
): PIXI.Graphics {
  const obstacleUpper = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
  obstacleUpper.height = obstacleHeights[0];
  obstacleUpper.x = app.canvas.width;

  return obstacleUpper;
}

function generateObstacleLower(
  app: PIXI.Application,
  obstacleHeights: number[]
): PIXI.Graphics {
  const obstacleLower = new PIXI.Graphics().rect(0, 0, 20, 20).fill("red");
  obstacleLower.height = obstacleHeights[1];
  obstacleLower.x = app.canvas.width;
  obstacleLower.y = app.canvas.height - obstacleLower.height;

  return obstacleLower;
}

function getObstacles(app: PIXI.Application, obstacleHeights: number[]): void {
  let obstacleUpper = generateObstacleUpper(app, obstacleHeights);
  app.stage.addChild(obstacleUpper);
  obstaclesArr.push(obstacleUpper);
  let obstacleLower = generateObstacleLower(app, obstacleHeights);
  app.stage.addChild(obstacleLower);
  obstaclesArr.push(obstacleLower);
}

let keys: { [key: string]: boolean } = {};
let gameRunning = false;
const obstaclesArr: PIXI.Graphics[] = [];

(async () => {
  const app = new PIXI.Application();
  await app.init({ antialias: true, width: 700, height: 500 });
  document.body.appendChild(app.canvas);

  const player = new PIXI.Graphics().circle(0, 0, 30).fill("green");
  player.x = 200;
  player.y = app.canvas.height / 2;
  player.pivot.set(0.5);
  app.stage.addChild(player);

  const ceil = new PIXI.Graphics().rect(0, 0, app.canvas.width, 20).fill("red");
  app.stage.addChild(ceil);

  const floor = new PIXI.Graphics()
    .rect(0, 0, app.canvas.width, 20)
    .fill("red");
  floor.y = app.canvas.height - floor.height;
  app.stage.addChild(floor);

  const bordersHeight = ceil.height + floor.height;

  setInterval(() => {
    const obstacleHeights = getRandomHeights(app, bordersHeight);
    getObstacles(app, obstacleHeights);
  }, 1000);

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  app.ticker.add(() => {
    startGame();
    if (gameRunning) {
      if (!collide(player, ceil, floor)) {
        movePlayer(player);

        obstaclesArr.forEach((obs) => {
          obs.x -= 5;
        });
      }
    }
  });
})();
