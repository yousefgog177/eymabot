
const config = require("./config.js")
const mongoose = require("mongoose")
const Sharder = require('eris-sharder').Master;

require("./db.js")()

const sharder = new Sharder(config.BOT_TOKEN , "/sharder.js", {
  stats: true,
  debug: true,
 shards: config.BOT_SHARDS || 1,
clusters: 1,
  guildsPerShard: config.BOT_GUILDS || 1300,
  name: config.BOT_NAME || "None",
  webhooks: config.BOT_WEBHOOKS,
  clientOptions: {
      messageLimit: 250,
      restMode: true
  }
});

process.on("unhandledRejection", (err) => { console.log(err) });
