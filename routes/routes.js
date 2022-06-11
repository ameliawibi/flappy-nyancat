import { resolve } from "path";
import {
  displayScore,
  gameOver,
  increaseScore,
} from "../controllers/gameScore";
import { postSignup, postLogin, logout } from "../controllers/userAuth";

export default function bindRoutes(app) {
  // Root route returns the Webpack-generated index.html file
  app.get("/", (request, response) => {
    response.sendFile(resolve("dist", "index.html"));
  });
  app.post("/login", postLogin);
  app.post("/signup", postSignup);
  app.get("/logout", logout);

  app.get("/displayscore", displayScore);

  app.get("/increase", increaseScore);

  app.get("/gameover", gameOver);
}
