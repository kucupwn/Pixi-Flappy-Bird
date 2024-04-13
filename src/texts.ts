import * as PIXI from "pixi.js";
import { Game } from "./main";

let prevFrame = Date.now();

export class Texts {
  game: Game;
  fpsCounter: number = 0;
  fpsAcc: number = 0;
  fpsLabel: PIXI.Text;
  startInfo: PIXI.Text;
  pauseInfo: PIXI.Text;
  restartInfo: PIXI.Text;
  gameModeInfo: PIXI.Text;
  scoreLabel: PIXI.Text;
  highscoreLabel: PIXI.Text;
  gameoverText: PIXI.Text;

  constructor(game: Game) {
    this.game = game;
    this.fpsLabel = new PIXI.Text();
    this.scoreLabel = new PIXI.Text();
    this.highscoreLabel = new PIXI.Text();
    this.startInfo = new PIXI.Text();
    this.pauseInfo = new PIXI.Text();
    this.restartInfo = new PIXI.Text();
    this.gameModeInfo = new PIXI.Text();
    this.gameoverText = new PIXI.Text();
  }

  // Initialize font family and UI texts
  public async initFont() {
    PIXI.Assets.add({
      alias: "ArcadeClassic",
      src: "./assets/Font/ARCADECLASSIC.TTF",
    });
    await PIXI.Assets.load("ArcadeClassic");

    this.fpsLabel = new PIXI.Text({
      text: "FPS",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 30 },
    });
    this.scoreLabel = new PIXI.Text({
      text: "",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 30 },
    });
    this.highscoreLabel = new PIXI.Text({
      text: "",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 30 },
    });
    this.startInfo = new PIXI.Text({
      text: "Press 'Space' to start!",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 35 },
    });
    this.pauseInfo = new PIXI.Text({
      text: "Press 'Escape' to pause / unpause!",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 35 },
    });
    this.restartInfo = new PIXI.Text({
      text: "Press 'Enter' to restart!",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 35 },
    });
    this.gameModeInfo = new PIXI.Text({
      text: "Press 'F5' to select game mode!",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 35 },
    });
    this.gameoverText = new PIXI.Text({
      text: "Game Over",
      style: { fill: "black", fontFamily: "ArcadeClassic", fontSize: 50 },
    });

    this.game._app.stage.addChild(this.scoreLabel);
    this.game._app.stage.addChild(this.highscoreLabel);
  }

  // Add and position FPS counter
  public initFps(): void {
    this.game._app.stage.addChild(this.fpsLabel);
    this.fpsLabel.x = 10;
    this.fpsLabel.y = 15;
    this.fpsLabel.zIndex = 1;
  }

  // Calculate and display FPS
  public displayFps(): void {
    let currFrame = Date.now();
    let difference = currFrame - prevFrame;
    prevFrame = currFrame;

    this.fpsAcc += difference;
    this.fpsCounter++;

    if (this.fpsAcc > 1000) {
      let fps = Math.floor(this.fpsCounter / (this.fpsAcc / 1000));
      this.fpsLabel.text = fps;

      this.fpsAcc = 0;
      this.fpsCounter = 0;
    }
  }

  // Add, position and display user contol info
  public userControlInfo(): void {
    this.game._app.stage.addChild(this.startInfo);
    this.startInfo.anchor.set(0.5);
    this.startInfo.x = this.game._app.canvas.width / 2;
    this.startInfo.y = this.game._app.canvas.height * 0.1;

    this.game._app.stage.addChild(this.restartInfo);
    this.restartInfo.anchor.set(0.5);
    this.restartInfo.x = this.game._app.canvas.width / 2;
    this.restartInfo.y = this.game._app.canvas.height * 0.2;

    this.game._app.stage.addChild(this.pauseInfo);
    this.pauseInfo.anchor.set(0.5);
    this.pauseInfo.x = this.game._app.canvas.width / 2;
    this.pauseInfo.y = this.game._app.canvas.height * 0.3;

    this.game._app.stage.addChild(this.gameModeInfo);
    this.gameModeInfo.anchor.set(0.5);
    this.gameModeInfo.x = this.game._app.canvas.width / 2;
    this.gameModeInfo.y = this.game._app.canvas.height * 0.4;
  }

  // Display score
  public displayScore(): void {
    this.scoreLabel.x = 10;
    this.scoreLabel.y = this.game._app.canvas.height * 0.94;
    this.scoreLabel.zIndex = 2;
    this.scoreLabel.text = `Score: ${this.game.score}`;
  }

  // Display highscore
  public displayHighscore(): void {
    this.highscoreLabel.y = this.game._app.canvas.height * 0.94;
    this.highscoreLabel.x = this.game._app.canvas.width * 0.7;
    this.highscoreLabel.zIndex = 2;
    this.highscoreLabel.text = `Highscore: ${this.game.highScore}`;
  }

  // Check and set highscore
  public setHighscore(): void {
    if (this.game.score > this.game.highScore) {
      this.game.highScore = this.game.score;
    }
  }

  public displayGameoverText() {
    this.game._app.stage.addChild(this.gameoverText);
    this.gameoverText.anchor.set(0.5);
    this.gameoverText.x = this.game._app.canvas.width / 2;
    this.gameoverText.y = this.game._app.canvas.height * 0.3;
  }
}
