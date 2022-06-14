import express from "express";
import bindRoutes from "./routes/routes";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import init from "./socket/server";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride("_method"));
// Expose the files stored in the distribution folder
app.use(express.static("dist"));

app.use(cookieParser());

// Bind route definitions to the Express application
bindRoutes(app);

// Set Express to listen on the given port
const PORT = process.env.PORT || 3004;

init(io);

httpServer.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
