import Phaser from "phaser";
import PreloadScene from "./scene/PreloadScene";
import PlayScene from "./scene/PlayScene";
import MenuScene from "./scene/MenuScene";
import ScoreScene from "./scene/ScoreScene";
import PauseScene from "./scene/PauseScene";
import LoginScene from "./scene/LoginScene";
import "core-js/es/function";
import "./main.scss";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
  parent: "canvas",
};

const Scenes = [
  PreloadScene,
  LoginScene,
  MenuScene,
  ScoreScene,
  PlayScene,
  PauseScene,
];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  //WebGL
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
