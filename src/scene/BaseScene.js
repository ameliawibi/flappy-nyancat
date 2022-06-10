import Phaser from "phaser";
import { io } from "socket.io-client";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#CD00FF" };
    this.screenCenter = [config.width / 2, config.height / 2];
    this.socket = io();
  }

  create() {
    this.createBG();
    if (this.config.canGoBack) {
      this.createBackButton();
    }
    this.socket.on("connect", () => {
      console.log("socket connected");
    });
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setScale(0.7);
  }

  createBackButton() {
    const backButton = this.add
      .image(40, 40, "back")
      .setScale(0.1)
      .setInteractive();

    backButton.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY,
      ];
      menuItem.textGO = this.add
        .text(...menuPosition, menuItem.text, this.fontOptions)
        .setOrigin(0.5, 1)
        .setInteractive();
      lastMenuPositionY += this.lineHeight;

      setupMenuEvents(menuItem);
    });
  }
  overlay(isLogin) {
    let el;
    if (isLogin) {
      el = document.getElementById("overlay");
    }
    if (!isLogin) {
      el = document.getElementById("overlay2");
    }
    el.style.visibility =
      el.style.visibility == "visible" ? "hidden" : "visible";
    window.scrollTo(0, 0);
  }
  clearInput() {
    document.getElementById("uname").value = "";
    document.getElementById("uname2").value = "";
    document.getElementById("psw").value = "";
    document.getElementById("psw2").value = "";
  }
}

export default BaseScene;
