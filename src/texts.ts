import * as PIXI from "pixi.js";
import { Game } from "./main";

export class Texts {
  game: Game;
  startInfo: PIXI.Text;
  pauseInfo: PIXI.Text;
  restartInfo: PIXI.Text;
  scoreLabel: PIXI.Text;
  highscoreLabel: PIXI.Text;

  constructor(game: Game) {
    this.game = game;
    this.scoreLabel = new PIXI.Text({ text: "", style: { fill: "black" } });
    this.highscoreLabel = new PIXI.Text({ text: "", style: { fill: "black" } });
    this.startInfo = new PIXI.Text({
      text: "Press 'Space' to start!",
      style: { fill: "black" },
    });
    this.pauseInfo = new PIXI.Text({
      text: "Press 'Escape' to pause/unpause!",
      style: { fill: "black" },
    });
    this.restartInfo = new PIXI.Text({
      text: "Press 'Enter' to restart!",
      style: { fill: "black" },
    });
  }

  public controlInfo() {
    this.game._app.stage.addChild(this.startInfo);
    this.startInfo.anchor.set(0.5);
    this.startInfo.x = this.game._app.canvas.width / 2;
    this.startInfo.y = this.game._app.canvas.height * 0.2;

    this.game._app.stage.addChild(this.restartInfo);
    this.restartInfo.anchor.set(0.5);
    this.restartInfo.x = this.game._app.canvas.width / 2;
    this.restartInfo.y = this.game._app.canvas.height * 0.3;

    this.game._app.stage.addChild(this.pauseInfo);
    this.pauseInfo.anchor.set(0.5);
    this.pauseInfo.x = this.game._app.canvas.width / 2;
    this.pauseInfo.y = this.game._app.canvas.height * 0.4;
  }

  public displayScore() {
    this.game._app.stage.addChild(this.scoreLabel);
    this.scoreLabel.y = this.game._app.canvas.height * 0.94;
    this.scoreLabel.zIndex = 1;
    this.scoreLabel.text = `Score: ${this.game._gameWorld.countObstacles()}`;
  }

  public displayHighscore() {
    this.game._app.stage.addChild(this.highscoreLabel);
    this.highscoreLabel.y = this.game._app.canvas.height * 0.94;
    this.highscoreLabel.x = this.game._app.canvas.width * 0.75;
    this.highscoreLabel.zIndex = 1;
    this.highscoreLabel.text = `Highscore: ${this.game.highScore}`;
  }

  public setHighscore() {
    if (this.game.score > this.game.highScore) {
      this.game.highScore = this.game.score;
    }
  }
}
