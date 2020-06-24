require("dotenv").config();

module.exports = {
  auth: {
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    env: process.env.TWITTER_WEBHOOK_ENV,
  },

  server: {
    port: process.env.PORT || 3000,
  },
};
