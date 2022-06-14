import BaseScene from "./BaseScene";
import axios from "axios";
import socket from "../../socket/client";

class LoginScene extends BaseScene {
  constructor(config) {
    super("LoginScene", config);
  }

  create() {
    super.create();
    this.overlay(true);
    //go to menu scene,hide login form
    document
      .getElementById("submit")
      .addEventListener("click", () => this.postLogin());

    //hide the login form, show sign up form
    document.getElementById("signup").addEventListener("click", () => {
      this.overlay(false);
      this.overlay(true);
      this.clearInput();
    });
    //hide the signup form, show login form
    document.getElementById("login").addEventListener("click", () => {
      this.overlay(false);
      this.overlay(true);
      this.clearInput();
    });
    //show login form, hide sign up form
    document
      .getElementById("submit2")
      .addEventListener("click", () => this.postSignUp());
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
        this.clearInput();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  postSignUp() {
    const data = {
      uname2: document.getElementById("uname2").value,
      psw2: document.getElementById("psw2").value,
    };
    // Make a request to create an item
    axios
      .post("/signup", data)
      .then((response) => {
        // handle success
        console.log(response);
        this.overlay(true);
        this.overlay(false);
        this.clearInput();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }
}

export default LoginScene;
