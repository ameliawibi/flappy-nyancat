import BaseScene from "./BaseScene";
import axios from "axios";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    this.createScore();
  }

  createScore() {
    axios
      .get("/displayscore")
      .then((response) => {
        this.add
          .text(
            ...this.screenCenter,
            `Best score: ${response.data.personalBest || 0}`,
            this.fontOptions
          )
          .setOrigin(0.5);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
    /*const bestScore = localStorage.getItem("bestScore");
    this.add
      .text(
        ...this.screenCenter,
        `Best score: ${bestScore || 0}`,
        this.fontOptions
      )
      .setOrigin(0.5);
    */
  }
}

export default ScoreScene;
