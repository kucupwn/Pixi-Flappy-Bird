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
function pointSoundValidatorNormalMode(game: Game, obs: PIXI.Sprite): void {
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
    }
  }
}

// Valdate obstacle position to play point sound in rapid mode
function pointSoundValidatorRapidMode(game: Game, obs: PIXI.Sprite): void {
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
    }
  }
}

// Hit sound and switch
export function playPointSound(game: Game): void {
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
export function setObstacleDistance(game: Game): void {
  const level2Threshold = game._gameWorld.level[2] - 1;
  const level1Threshold = game._gameWorld.level[1] - 1;
  const currentDistance = game._gameWorld.obstacleDistance;

  if (game.score >= level2Threshold) {
    game._gameWorld.obstacleDistance = currentDistance < 350 ? 320 : 420;
  } else if (game.score >= level1Threshold) {
    game._gameWorld.obstacleDistance = currentDistance < 350 ? 280 : 380;
  }
}

function setAnimationSpeed(game: Game, num: number): number {
  return game._gameWorld.animationSpeed + num;
}

// Set background, floor, ceil speed progression
export function setGameWorldSpeed(game: Game, animationLevel: number): void {
  let backgroundSpeedAdjustment = 0;

  if (game.score >= game._gameWorld.level[2]) {
    backgroundSpeedAdjustment = 0.2;
    animationLevel = 2;
  } else if (game.score >= game._gameWorld.level[1]) {
    backgroundSpeedAdjustment = 0.1;
    animationLevel = 1;
  }

  game._gameWorld.background.tilePosition.x -=
    game._gameWorld.backgroundSpeed + backgroundSpeedAdjustment;

  game._gameWorld.ceil.tilePosition.x -= setAnimationSpeed(
    game,
    animationLevel
  );

  game._gameWorld.floor.tilePosition.x -= setAnimationSpeed(
    game,
    animationLevel
  );
}

// Set obstacle speed progression
export function setObstacleSpeed(
  game: Game,
  obstacle: PIXI.Sprite,
  animationLevel: number
): void {
  if (game.score >= game._gameWorld.level[2]) {
    obstacle.x -= setAnimationSpeed(game, animationLevel);
  } else if (game.score >= game._gameWorld.level[1]) {
    obstacle.x -= setAnimationSpeed(game, animationLevel);
  } else {
    obstacle.x -= setAnimationSpeed(game, animationLevel);
  }
}
