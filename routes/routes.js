import { resolve } from "path";

export default function bindRoutes(app) {
  // Root route returns the Webpack-generated index.html file
  app.get("/", (request, response) => {
    response.sendFile(resolve("dist", "index.html"));
  });
}
