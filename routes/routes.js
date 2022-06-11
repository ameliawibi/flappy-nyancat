import { resolve } from "path";

import { postSignup, postLogin, logout } from "../controllers/userAuth";

export default function bindRoutes(app) {
  // Root route returns the Webpack-generated index.html file
  app.get("/", (request, response) => {
    response.sendFile(resolve("dist", "index.html"));
  });
  app.post("/login", postLogin);
  app.post("/signup", postSignup);
  app.get("/logout", logout);
}
