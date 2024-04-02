import * as PIXI from "pixi.js";
import { Game } from "./main";
import { sound } from "@pixi/sound";

// Get Y position for one obstacle
function getObstacleOffset(): number {
  return Math.floor(Math.random() * 250 + 50);
}

// Set position and add obstacles to canvas and array
export function getObstacles(game: Game, texture: PIXI.Texture): void {
  const obstacleClone1 = PIXI.Sprite.from(texture);
  obstacleClone1.x = game._app.canvas.width;
  obstacleClone1.y = getObstacleOffset();
  obstacleClone1.scale.y *= -1;

  const obstacleClone2 = PIXI.Sprite.from(texture);
  obstacleClone2.x = game._app.canvas.width;
  obstacleClone2.y = obstacleClone1.y + game._gameWorld.obstacleGap;

  const distance =
    game._app.canvas.width -
      game._gameWorld.obstaclesArr[game._gameWorld.obstaclesArr.length - 1]
        ?.x <=
    game._gameWorld.obstacleDistance;

  if (game.gameRunning && !distance) {
    game._app.stage.addChild(obstacleClone1);
    game._gameWorld.obstaclesArr.push(obstacleClone1);
    game._app.stage.addChild(obstacleClone2);
    game._gameWorld.obstaclesArr.push(obstacleClone2);
  }
}

// Valdate obstacle position to play point sound in normal mode
function pointSoundValidatorNormalMode(game: Game, obs: PIXI.Sprite) {
  if (game._gameWorld.animationSpeed === 3) {
    if (
      !game._gameWorld.pointSound &&
      obs.getBounds().maxX >=
        Math.floor(game._player.bird.x - game._player.bird.width / 2) - 1 &&
      obs.getBounds().maxX <=
        Math.floor(game._player.bird.x - game._player.bird.width / 2) + 1
    ) {
      sound.play("point");
      game._gameWorld.pointSound = true;
      return;
    }
  }
}

// Valdate obstacle position to play point sound in rapid mode
function pointSoundValidatorRapidMode(game: Game, obs: PIXI.Sprite) {
  if (game._gameWorld.animationSpeed === 6) {
    if (
      !game._gameWorld.pointSound &&
      obs.getBounds().maxX >=
        Math.floor(game._player.bird.x - game._player.bird.width / 2) &&
      obs.getBounds().maxX <=
        Math.floor(game._player.bird.x - game._player.bird.width / 2) + 6
    ) {
      sound.play("point");
      game._gameWorld.pointSound = true;
      return;
    }
  }
}

// Hit sound and switch
export function playPointSound(game: Game) {
  for (const obs of game._gameWorld.obstaclesArr) {
    pointSoundValidatorNormalMode(game, obs);
    pointSoundValidatorRapidMode(game, obs);
  }
  game._gameWorld.pointSound = false;
}

// Count passed obstacles; set score
export function countObstacles(game: Game): number {
  let count = 0;
  game._gameWorld.obstaclesArr.forEach((obs, i) => {
    if (i % 2 === 0) {
      if (obs.getBounds().maxX < game._player.bird.getBounds().minX) {
        count++;
      }
    }
  });

  return count;
}

// Set obstacles distance
// adjusted with -1 relative to speed progression change values to make the right distance right after speed progression event
export function setObstacleDistance(game: Game) {
  if (
    game.score >= game._gameWorld.level[2] - 1 &&
    game._gameWorld.obstacleDistance < 350
  ) {
    game._gameWorld.obstacleDistance = 340;
  } else if (
    game.score >= game._gameWorld.level[2] - 1 &&
    game._gameWorld.obstacleDistance >= 350
  ) {
    game._gameWorld.obstacleDistance = 420;
  } else if (
    game.score >= game._gameWorld.level[1] - 1 &&
    game._gameWorld.obstacleDistance < 350
  ) {
    game._gameWorld.obstacleDistance = 320;
  } else if (
    game.score >= game._gameWorld.level[1] - 1 &&
    game._gameWorld.obstacleDistance >= 350
  ) {
    game._gameWorld.obstacleDistance = 380;
  }
}

// Set background, floor, ceil speed progression
export function setGameWorldSpeed(game: Game) {
  if (game.score >= game._gameWorld.level[2]) {
    game._gameWorld.background.tilePosition.x -= 0.5;
    game._gameWorld.ceil.tilePosition.x -= game._gameWorld.animationSpeed + 2;
    game._gameWorld.floor.tilePosition.x -= game._gameWorld.animationSpeed + 2;
  } else if (game.score >= game._gameWorld.level[1]) {
    game._gameWorld.background.tilePosition.x -= 0.4;
    game._gameWorld.ceil.tilePosition.x -= game._gameWorld.animationSpeed + 1;
    game._gameWorld.floor.tilePosition.x -= game._gameWorld.animationSpeed + 1;
  } else {
    game._gameWorld.background.tilePosition.x -= 0.3;
    game._gameWorld.ceil.tilePosition.x -= game._gameWorld.animationSpeed;
    game._gameWorld.floor.tilePosition.x -= game._gameWorld.animationSpeed;
  }
}

// Set obstacle speed progression
export function setObstacleSpeed(game: Game, obstacle: PIXI.Sprite) {
  if (game.score >= game._gameWorld.level[2]) {
    obstacle.x -= game._gameWorld.animationSpeed + 2;
  } else if (game.score >= game._gameWorld.level[1]) {
    obstacle.x -= game._gameWorld.animationSpeed + 1;
  } else {
    obstacle.x -= game._gameWorld.animationSpeed;
  }
}
