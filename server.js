("use strict");

// // Pass --options via CLI arguments in command to enable these options.
// const options = {};

// module.exports = async function (fastify, opts) {
//   fastify.get("/", async function (request, reply) {
//     return "Timeweb Cloud + Fastify =️ ❤️";
//   });
// };

// module.exports.options = options;

const fastifyStatic = require("@fastify/static");
const fastifyView = require("@fastify/view");
const fastifyCors = require("@fastify/cors");

const twig = require("twig");
const { Server } = require("socket.io");

const path = require("path");

const viewsPath = path.join(__dirname, "views");

const options = {};

module.exports = async function (fastify, opts) {
  let users = {};

  const io = new Server(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    allowEIO3: true,
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
  });
  
  fastify.register(fastifyView, {
    engine: { twig },
    root: viewsPath,
  });
  
  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST"],
  });

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
};

module.exports.options = options;

// fastify.listen({ port: 3000 });
