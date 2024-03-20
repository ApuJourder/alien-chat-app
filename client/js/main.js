import { io } from "../socket.io/socket.io.esm.min.js";

const chatbox = document.querySelector(".chatbox");
const sendBtn = document.getElementById("send-btn");
const textarea = document.querySelector(".chat-input textarea");

const inputInitHeight = textarea.scrollHeight;

const socket = io();

let name = prompt("Enter your name...");
socket.emit("userJoined", name);

socket.on("newUser", (name) => {
  const p = document.createElement("p");
  p.classList.add("info");
  p.textContent = `${name} joined the chat`;

  chatbox.appendChild(p);
});

const createMsg = (text, cls) => {
  const li = document.createElement("li");
  const p = document.createElement("p");

  li.classList.add("chat", `${cls}`);
  li.appendChild(p);
  li.querySelector("p").textContent = text;

  return li;
};

sendBtn.onclick = () => {
  const msg = textarea.value.trim();

  if (!msg) return;
  textarea.value = "";
  textarea.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createMsg(msg, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  socket.emit("send", msg);
};

socket.on("recive", (msg) => {
  chatbox.appendChild(createMsg(msg, "incoming"));
  chatbox.scrollTo(0, chatbox.scrollHeight);
});
