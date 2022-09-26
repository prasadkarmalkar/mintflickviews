const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = process.env.PORT ||4000;
const io = new Server(server,{
    cors: {
      origin: "*"
    }
  });

const live = new Map();

app.get("/", (req, res) => {
  res.send("server is up and running :-)");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  let myroom = null;

  socket.on("joinlivestream", (username) => {
    socket.join(username);
    myroom = username;
    const templ = live.get(username)
    if(templ){
        live.set(username,templ+1);
    }else{
        live.set(username,1);
    }
    io.to(username).emit("count",live.get(myroom))
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const templ = live.get(myroom);
    live.set(myroom,templ-1);
    io.to(myroom).emit("count",live.get(myroom))
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
