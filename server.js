const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");
const path = require("path");

const PORT = 8000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  //? HOST
  //* Create room, return URL back to user ==> (back)
  socket.emit("personalId", socket.id);

  //* on("request-join"), display caller information (name, uniqueId), store signal data in state ==> (back)
  socket.on("request-join", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("request-approval", {
      signal: signalData,
      userId: from,
      name,
    });
  });

  //* onClick(accpet) ==> peer.signal(callerSignal), create new peer
  //* emit("accept-request"), pass signal data ==> (front)

  //? Participant
  //* onload (join via link), create id... onClick, create new peer (initator) ==> (front)
  //* emit("join-room") pass (roomId, signal, userInfo) ==> (front)
  //* on("join-room", (:roomId) ==> to(host id).emit("request-join") ==> (back)
  //* on("accept-request"), complete connection ==> (front)
  socket.on("accept-request", ({ signal, callerId }) => {
    io.to(callerId).emit("request-accepted", signal);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
