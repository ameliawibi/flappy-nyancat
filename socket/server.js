export default function init(io) {
  io.on("connection", (socket) => {
    console.log("a user is connected");
    console.log("socket id: ", socket.id);

    let gameRoom = "gameRoom";

    socket.on("subscribe", async () => {
      let gameHistory = { data: "player" };
      socket.join(gameRoom);
      console.log("a user has joined our room: " + gameRoom);

      io.to(gameRoom).emit("joinRoom", gameHistory);
    });
  });
}
