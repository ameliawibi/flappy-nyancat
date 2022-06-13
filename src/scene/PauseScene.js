import BaseScene from "./BaseScene";
import axios from "axios";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);
    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit to Menu" },
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
      if (menuItem.scene && menuItem.text === "Continue") {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      }
      if (menuItem.scene && menuItem.text === "Exit to Menu") {
        axios
          .get("/reset")
          .then((response) => {
            this.otherPlayerExit();
            this.scene.stop("PlayScene");
            this.scene.start(menuItem.scene);
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
      }
    });
  }
}

export default PauseScene;
