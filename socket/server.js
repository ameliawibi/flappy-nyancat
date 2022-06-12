export default function init(io) {
  io.on("connection", (socket) => {
    console.log("a user is connected");
    console.log("socket id: ", socket.id);
    socket.on("disconnect", function () {
      console.log("user disconnected");
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit("disconnected", socket.id);
    });

    let players = {};
    players[socket.id] = {
      playerId: socket.id,
      x: 80,
      y: 300,
    };
    // send the players object to the new player
    //socket.emit("currentPlayers", players);
    // update all other players of the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);

    let gameRoom = "gameRoom";

    socket.on("subscribe", async () => {
      socket.join(gameRoom);
      console.log("a user has joined our room: " + socket.id);

      io.to(gameRoom).emit("currentPlayers", players);
    });
  });
}
