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
            `Your best score: ${response.data.personalBest || 0}`,
            this.fontOptions
          )
          .setOrigin(0.5);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }
}

export default ScoreScene;
