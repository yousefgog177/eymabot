const Base = require('eris-sharder').Base
const config = require("./config.js")


module.exports =  class extends Base{
    constructor(bot) {
        super(bot);
    }

async launch() {
    

this.bot.config = require("./config.js")

this.bot.guildSettings = require("./guildSchema")

await require("./bot.js")(this.bot)

await require("./dashboard")(this.bot , config.DASHBOARD_PORT , true)

this.bot.on("error", (err) => console.error(err.message))

    }

}

