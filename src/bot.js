const ngrok = require("ngrok");
const auth = require("config").get("auth");
const port = require("config").get("server").port;
const Twit = require("twit");
import { Autohook } from "twitter-autohook";

const bot = {
  async initilaize() {
    //setup hooks
    await this.initHooks();

    //setup twit
    await this.initTwit();
  },

  async initHooks() {
    // try to make this more elegant
    const url =
      process.env.NODE_ENV === "development"
        ? await ngrok.connect(port)
        : process.env.URL_BASE;
    const webhookURL = `${url}/webhook`;

    this.webhook = new Autohook(auth);

    // assign event handlers here

    await this.webhook.removeWebhooks();
    await this.webhook.start(webhookURL);
    await this.webhook.subscribe({
      oauth_token: auth.token,
      oauth_token_secret: auth.token_secret,
    });
  },

  async initTwit() {
    //change this to use config.js
    const config = {
      consumer_key: auth.consumer_key,
      consumer_secret: auth.consumer_secret,
      access_token: auth.token,
      access_token_secret: auth.token_secret,
    };

    this.twit = new Twit(config);
  },
};

export default bot;
