const express = require("express");
const cors = require("cors");
const {Autohook, validateWebhook, validateSignature} = require("twitter-autohook");

const url = require('url');
const ngrok = require('ngrok');
const http = require('http');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
let config;

const app = express();
app.set("port", PORT);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/standalone-server/webhook", (req, res) => {
  if (req.query.crc_token) {
    try {
      if (!validateSignature(req.headers, auth, url.parse(req.url).query)) {
        console.error('Cannot validate webhook signature');
        return;
      };
    } catch (e) {
      console.error(e);
    }

    const crc = validateWebhook(route.query.crc_token, auth, res);
    res.status(200).json(crc);
  }

  res.end();
});

app.post("/standalone-server/webhook", (req, res) => {  
  try {
    if (!validateSignature(req.headers, config, req.body)) {
      console.error('Cannot validate webhook signature');
      return;
    };
  } catch (e) {
    console.error(e);
  }

  console.log('Event received:', body);
  res.status(200).end();

})

const startServer = (port) => {  
  const server = http.createServer(app);

  server.on("listening", () => {
    const address = server.address();
    const bind =
      typeof address === "string" ? `pipe ${address}` : `port ${port}`;
    console.log(`Listening on ${bind}`);
  });

  server.listen(port);
}

(async () => {
  try {
    const url = process.env.HOST_URL || await ngrok.connect(PORT);    
    const webhookURL = `${url}/standalone-server/webhook`;
    config = {
      token: process.env.TWITTER_ACCESS_TOKEN,
      token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      env: process.env.TWITTER_WEBHOOK_ENV,
    };

    const server = startServer(PORT);


    const webhook = new Autohook(config);
    await webhook.removeWebhooks();
    await webhook.start(webhookURL);
    await webhook.subscribe({
      oauth_token: config.token,
      oauth_token_secret: config.token_secret,
    });
    
  } catch(e) {
    console.error(e);
    process.exit(-1);
  }
})();