import { resolve } from "path";

export default function bindRoutes(app) {
  // Root route returns the Webpack-generated index.html file
  app.get("/", (request, response) => {
    response.sendFile(resolve("dist", "index.html"));
  });

  app.post("/login", (req, res) => {
    try {
      console.log(req.body);
      if (req.body.uname === "a" && req.body.psw === "a") {
        res.sendStatus(200);
      }
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/signup", (req, res) => {
    try {
      console.log(req.body);
      if (req.body.uname2 === "b" && req.body.psw2 === "b") {
        res.sendStatus(200);
      }
    } catch (error) {
      console.log(error);
    }
  });
}
