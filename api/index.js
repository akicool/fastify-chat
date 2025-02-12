import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import Fastify from "fastify";
import path from "path";
import { Server } from "socket.io";
import twig from "twig";
import { fileURLToPath } from "url";

const fastify = Fastify({
  logger: true,
});

// const socket = io("https://fastify-chat-akicool.vercel.app", {
//   transports: ["polling"],
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewsPath = path.join(__dirname, "..", "views");
const io = new Server(fastify.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

fastify.register(fastifyView, {
  engine: { twig },
  root: viewsPath,
});

//
fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST"],
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

// let users = new Set();
let users = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("set_username", (name) => {
    users[socket.id] = name;
    io.emit("update_users", Object.keys(users).length);
    io.emit("chat_message", {
      user: "CHAT: ",
      message: `${name} подключился!`,
    });
  });

  socket.on("chat_message", (msg) => {
    if (users[socket.id]) {
      io.emit("chat_message", { user: users[socket.id], message: msg });
    }
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      const username = users[socket.id];
      delete users[socket.id];
      io.emit("update_users", users.size);
      io.emit("chat_message", {
        user: "CHAT: ",
        message: `${username} вышел.`,
      });
    }
  });
});

fastify.get("/", async (req, reply) => {
  return reply.view("index.twig", { onlineUsers: users.size });
});

fastify.listen({ port: 3000 });

// fastify.get("/", (req, reply) => {
//   reply.sendFile("index.html");
// });
