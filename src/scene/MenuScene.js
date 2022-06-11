import axios from "axios";
import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Best score" },
      { scene: "LoginScene", text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#CD00FF" });
    });

    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        this.signOut(menuItem);
      }
    });
  }

  signOut(menuItem) {
    axios
      .get("/logout")
      .then((response) => {
        // handle success
        console.log(response);
        this.scene.start(menuItem.scene);
        this.overlay(true);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }
}

export default MenuScene;
