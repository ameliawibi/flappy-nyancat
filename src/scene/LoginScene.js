import BaseScene from "./BaseScene";
import axios from "axios";

/*axios
  .get("https://restcountries.com/v3.1/name/peru")
  .then((res) => {
    //console.log(res);
    const canvas = document.getElementById("canvas");
    const text = document.createElement("p");
    text.innerText = "Flappy";
    canvas.appendChild(text);
  })
  .catch((error) => {
    // handle error
    //console.log(error);
  });
*/

class LoginScene extends BaseScene {
  constructor(config) {
    super("LoginScene", config);
    this.menu = [{ scene: "MenuScene", text: "Login" }];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    this.overlay();
    document
      .getElementById("submit")
      .addEventListener("click", () => this.postLogin());
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
      this.overlay();
    });
  }

  postLogin() {
    const data = {
      uname: document.getElementById("uname").value,
      psw: document.getElementById("psw").value,
    };
    // Make a request to create an item
    axios
      .post("/login", data)
      .then((response) => {
        // handle success
        console.log(response);
        this.scene.start("MenuScene");
        this.overlay();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }
}

export default LoginScene;
