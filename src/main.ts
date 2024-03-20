import * as PIXI from "pixi.js";

let moveUp: { [key: string]: boolean } = {};

(async () => {
  const app = new PIXI.Application();
  await app.init({ antialias: true, width: 700, height: 500 });
  document.body.appendChild(app.canvas);
  console.log(app);

  const player = new PIXI.Graphics().circle(0, 0, 30).fill("green");
  player.x = 200;
  player.y = 200;
  app.stage.addChild(player);

  const floor = new PIXI.Graphics()
    .rect(0, 0, app.canvas.width, 20)
    .fill("red");
  floor.y = app.canvas.height - floor.height;
  app.stage.addChild(floor);

  const ceil = new PIXI.Graphics().rect(0, 0, app.canvas.width, 20).fill("red");
  app.stage.addChild(ceil);

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  function keyDown(e: KeyboardEvent): void {
    moveUp[e.key] = true;
  }

  function keyUp(e: KeyboardEvent): void {
    moveUp[e.key] = false;
  }

  function movePlayer(): void {
    if (moveUp[" "]) {
      player.y -= 5;
    } else {
      player.y += 5;
    }
  }

  app.ticker.add(movePlayer);
})();
