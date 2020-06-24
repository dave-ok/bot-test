const bot = {
  async initilaize() {
    //setup hooks
    await this.initHooks();       

    //setup twit
    await this.initTwit();

  },

  async initHooks() {
    // try to make this more elegant
    const url = process.env.NODE_ENV = "development" ? await ngrok.connect(PORT) : process.env.URL_BASE;    
    const webhookURL = `${url}/webhook`;

    //change this to use config.js
    config = {
      token: process.env.TWITTER_ACCESS_TOKEN,
      token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      env: process.env.TWITTER_WEBHOOK_ENV,
    };

    this.webhook = new Autohook(config);

    // assign event handlers here

    await this.webhook.removeWebhooks();
    await this.webhook.start(webhookURL);
    await this.webhook.subscribe({
      oauth_token: config.token,
      oauth_token_secret: config.token_secret,
    });
  },

  async initTwit() {
    //change this to use config.js
    config = {
      token: process.env.TWITTER_ACCESS_TOKEN,
      token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      env: process.env.TWITTER_WEBHOOK_ENV,
    };

    this.twit = new Twit(config);
  }
}