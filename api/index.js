import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (req, reply) => {
  return reply.status(200).type("text/html").send(html);
});

fastify.get("/api", function (req, reply) {
  reply.send({ api: "worked" });
});

fastify.get("/hello", function (req, reply) {
  reply.send({ hello: "world" });
});

export default async function handler(req, reply) {
  await fastify.ready();
  fastify.server.emit("request", req, reply);
}

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
    />
    <title>Vercel + Fastify</title>
    <meta
      name="description"
      content="This is a starter template for Vercel + Fastify."
    />
  </head>
  <body>
    <h1>Vercel + Fastify </h1>

    <p>
      This is a starter template for Vercel + Fastify. It also includes example
      routes that can be accessed via the following links:
    </p>
    <ul>
      <li><a href="/api">/api</a></li>
      <li><a href="/hello">/hello</a></li>
    </ul>
  </body>
</html>
`;
