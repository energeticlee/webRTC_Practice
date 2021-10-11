const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");
const path = require("path");

const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  //? HOST
  //* Create room, return URL back to user
  //? Participant
  //* join-room (:roomId) ==>
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
