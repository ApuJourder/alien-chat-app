const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/chat", (req, res) => {
  res.redirect("/chat.html");
});

app.post("/registar", (req, res) => {
  const { name } = req.body;
  const token = jwt.sign({ name }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    secure: true,
  });
  res.redirect("/chat");
});

io.on("connection", (socket) => {
  socket.on("userJoined", (name) => {
    socket.broadcast.emit("newUser", name);
  });

  socket.on("send", (msg) => {
    socket.broadcast.emit("recive", msg);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

module.exports = { server, app };
