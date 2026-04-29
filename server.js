import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "http";

const app = express();
const bareServer = createBareServer("/bare/");

app.use(express.static("public"));

const server = createServer((req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on port ${PORT}`));
