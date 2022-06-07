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
  }

  create() {
    super.create();
    this.overlay(true);
    document
      .getElementById("submit")
      .addEventListener("click", () => this.postLogin());
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
        this.overlay(true);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }
}

export default LoginScene;
