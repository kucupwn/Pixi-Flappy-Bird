import { Game } from "./main";

export function collideWithBoundaries(game: Game): boolean {
  const playerTop = game._player.graphics.getBounds().minY;
  const playerBottom = game._player.graphics.getBounds().maxY;
  const ceilBottom = game._gameWorld.ceil.getBounds().maxY;
  const floorTop = game._gameWorld.floor.getBounds().minY;

  return playerTop <= ceilBottom || playerBottom >= floorTop;
}

export function collideWithObstacles(game: Game): boolean {
  for (const obstacle of game.obstaclesArr) {
    const playerLeft = game._player.graphics.getBounds().minX;
    const playerRight = game._player.graphics.getBounds().maxX;
    const playerTop = game._player.graphics.getBounds().minY;
    const playerBottom = game._player.graphics.getBounds().maxY;

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
      game.gameRunning = false;

      return true;
    }
  }

  return false;
}
