import * as PIXI from "pixi.js";
import { Game } from "./main";
import { sound } from "@pixi/sound";

function getObstacleOffset(): number {
  return Math.floor(Math.random() * 250 + 50);
}

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

export function playPointSound(game: Game) {
  for (const obs of game._gameWorld.obstaclesArr) {
    if (game._gameWorld.animationSpeed === 6) {
      if (
        !game._gameWorld.pointSound &&
        obs.getBounds().maxX >=
          Math.floor(
            game._app.canvas.width / 3 - game._player.bird.width / 2
          ) &&
        obs.getBounds().maxX <=
          Math.floor(game._app.canvas.width / 3 - game._player.bird.width / 2) +
            6
      ) {
        sound.play("point");
        game._gameWorld.pointSound = true;
        break;
      }
    } else if (game._gameWorld.animationSpeed === 3) {
      if (
        !game._gameWorld.pointSound &&
        obs.getBounds().maxX >=
          Math.floor(game._app.canvas.width / 3 - game._player.bird.width / 2) -
            1 &&
        obs.getBounds().maxX <=
          Math.floor(game._app.canvas.width / 3 - game._player.bird.width / 2) +
            1
      ) {
        sound.play("point");
        game._gameWorld.pointSound = true;
        break;
      }
    }
    game._gameWorld.pointSound = false;
  }
}

export function countObstacles(game: Game): number {
  let count = 0;
  game._gameWorld.obstaclesArr.forEach((obs, i) => {
    if (i % 2 === 0) {
      if (obs.getBounds().maxX < game._player.bird.getBounds().minX) {
        count++;
      }
    }
  });
  game.score = count;

  return count;
}

export function setObstacleDistance(game: Game) {
  if (game.score >= 49 && game._gameWorld.obstacleDistance < 350) {
    game._gameWorld.obstacleDistance = 340;
  } else if (game.score >= 49 && game._gameWorld.obstacleDistance >= 350) {
    game._gameWorld.obstacleDistance = 420;
  } else if (game.score >= 19 && game._gameWorld.obstacleDistance < 350) {
    game._gameWorld.obstacleDistance = 320;
  } else if (game.score >= 19 && game._gameWorld.obstacleDistance >= 350) {
    game._gameWorld.obstacleDistance = 380;
  }
}

export function gameWorldSpeedProgression(game: Game) {
  if (game.score >= 50) {
    game._gameWorld.background.tilePosition.x -= 0.4;
    game._gameWorld.ceil.tilePosition.x -= game._gameWorld.animationSpeed + 2;
    game._gameWorld.floor.tilePosition.x -= game._gameWorld.animationSpeed + 2;
  } else if (game.score >= 20) {
    game._gameWorld.background.tilePosition.x -= 0.3;
    game._gameWorld.ceil.tilePosition.x -= game._gameWorld.animationSpeed + 1;
    game._gameWorld.floor.tilePosition.x -= game._gameWorld.animationSpeed + 1;
  } else {
    game._gameWorld.background.tilePosition.x -= 0.2;
    game._gameWorld.ceil.tilePosition.x -= game._gameWorld.animationSpeed;
    game._gameWorld.floor.tilePosition.x -= game._gameWorld.animationSpeed;
  }
}

export function obstacleSpeedProgression(game: Game, obstacle: PIXI.Sprite) {
  if (game.score >= 50) {
    obstacle.x -= game._gameWorld.animationSpeed + 2;
  } else if (game.score >= 20) {
    obstacle.x -= game._gameWorld.animationSpeed + 1;
  } else {
    obstacle.x -= game._gameWorld.animationSpeed;
  }
}
