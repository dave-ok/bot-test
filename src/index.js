import bot from "./bot";
import webhookRouter from "./routes/webhook";
import apiRouter from "./routes/api";

const http = require("http");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = require("config").get("server").port;
const debug = require("debug")("log");

const app = express();
app.set("port", port);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/webhook", webhookRouter);
app.use("/api", apiRouter);

const startServer = (port) => {
  const server = http.createServer(app);

  server.on("listening", () => {
    const address = server.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port ${port}`;
    console.log(`Listening on ${bind}`);
  });

  server.listen(port);
};

(async () => {
  // start server
  await startServer(port);

  // initialize bot
  debug("Attempting to start bot ...");

  try {
    await bot.initilaize();
    debug("Bot started succesfully");
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }

  // start scheduler
})();
