"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var fastify = (0, fastify_1.default)({
    logger: true,
});
fastify.get("/123", function (request, reply) {
    reply.send({ hello: "world" });
});
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
