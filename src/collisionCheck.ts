import { Game } from "./main";

export function collideWithBoundaries(game: Game): boolean {
  const playerTop = game._player.bird.getBounds().minY;
  const playerBottom = game._player.bird.getBounds().maxY;
  const ceilBottom = game._gameWorld.ceil.y;
  const floorTop = game._gameWorld.floor.y;

  return playerTop <= ceilBottom || playerBottom >= floorTop;
}

export function collideWithObstacles(game: Game): boolean {
  for (const obstacle of game._gameWorld.obstaclesArr) {
    const playerLeft = game._player.bird.getBounds().minX;
    const playerRight = game._player.bird.getBounds().maxX;
    const playerTop = game._player.bird.getBounds().minY;
    const playerBottom = game._player.bird.getBounds().maxY;

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
