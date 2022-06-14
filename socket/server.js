export default function init(io) {
  let players = {};
  io.on("connection", (socket) => {
    console.log("a user is connected");
    console.log("socket id: ", socket.id);

    players[socket.id] = {
      playerId: socket.id,
      x: 80,
      y: 300,
    };

    console.log(players);

    socket.on("disconnect", function () {
      delete players[socket.id];
      io.to(gameRoom).emit("userLeft", socket.id);
      console.log(players);
      console.log("user disconnected");
      console.log("socket id: ", socket.id);
    });

    let gameRoom = "gameRoom";

    // send the players object to the new player
    //socket.emit("currentPlayers", players);
    // update all other players of the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("subscribe", async () => {
      players[socket.id] = {
        playerId: socket.id,
        x: 80,
        y: 300,
      };
      socket.join(gameRoom);
      console.log("a user has joined our room: " + socket.id);
      console.log(players);
      io.to(gameRoom).emit("currentPlayers", players);
      //io.to(gameRoom).emit("newPlayer", players[socket.id]);
    });

    socket.on("playerMovement", async (position) => {
      players[socket.id].x = position.xBird;
      players[socket.id].y = position.yBird;
      io.to(gameRoom).emit("playerMoved", players[socket.id]);
    });

    socket.on("unsubscribe", async () => {
      socket.leave(gameRoom);
      socket.disconnect();
      console.log("a user has left our room: " + socket.id);
      // remove this player from our players object
      delete players[socket.id];
      io.to(gameRoom).emit("userLeft", socket.id);
    });
  });
}
