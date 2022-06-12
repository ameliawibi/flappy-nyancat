import { user } from "pg/lib/defaults";

export default function init(io) {
  io.on("connection", (socket) => {
    console.log("a user is connected");
    console.log("socket id: ", socket.id);

    //listing all users
    const users = [];
    for (let [id] of io.of("/").sockets) {
      users.push({
        userID: id,
      });
    }
    socket.broadcast.emit("users", users);

    let gameRoom = "gameRoom";

    socket.on("subscribe", async () => {
      let userSocketId = { userID: users[users.length - 1].userID };
      socket.join(gameRoom);
      console.log("a user has joined our room: " + userSocketId);

      io.to(gameRoom).emit("joinRoom", userSocketId);
    });
  });
}
