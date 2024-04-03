import { Game } from "./main";
import { collideWithBoundaries, collideWithObstacles } from "./collisionCheck";

export class GameStatusEvents {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public eventListener(game: Game) {
    // Event listener for control game status
    window.addEventListener("keydown", (e) => {
      // Pause game
      if (
        e.key === "Escape" &&
        game.gameRunning &&
        game._gameWorld.obstaclesArr.length > 2
      ) {
        game.keylock = true;
        game.gameRunning = false;
        game._player.bird.stop();
        game._app.ticker.stop();
      } else if (
        e.key === "Escape" &&
        !game.gameRunning &&
        game._gameWorld.obstaclesArr.length > 2
      ) {
        game.keylock = false;
        game.gameRunning = true;
        game._player.bird.play();
        game._app.ticker.start();
      }

      // Start game and ticker; start only game
      if (!game.tickerAdded) {
        window.addEventListener("keydown", (e) => {
          if (
            e.key === " " &&
            !game.gameRunning &&
            !game.tickerAdded &&
            !game.keylock &&
            !game.gameEnded
          ) {
            game.startGame();
            game._app.ticker.add(game.gameLoop.bind(game));
            game.tickerAdded = true;
          }
        });
      } else if (game.tickerAdded) {
        window.addEventListener("keydown", (e) => {
          if (
            e.key === " " &&
            !game.gameRunning &&
            game.tickerAdded &&
            !game.keylock &&
            !game.gameEnded
          ) {
            game.startGame();
          }
        });
      }

      // Restart game
      if (
        e.key === "Enter" &&
        !game.keylock &&
        !game.gameRunning &&
        (collideWithBoundaries(game) || collideWithObstacles(game))
      ) {
        game._app.ticker.start();
        game.gameEnded = false;
        game.gameRunning = false;
        game.hitSound = false;
        game.score = 0;
        game._texts.displayScore();
        game._player.resetPlayer();
        game._gameWorld.resetGameWorld();
        game._gameWorld.animationLevel = 0;
        game._app.stage.addChild(game._texts.startInfo);
        game._app.stage.addChild(game._texts.pauseInfo);
        game._app.stage.addChild(game._texts.restartInfo);
        game._app.stage.addChild(game._texts.gameModeInfo);
      }
    });
  }
}
