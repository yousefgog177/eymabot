const fs = require("fs")


module.exports = async (bot) =>{

bot.commands = []

    let status = bot.config.BOT_STATUS.name.split("[PREFIX]").join(bot.config.PREFIX)
const events = fs.readdirSync(`./events/`).filter(file => file.endsWith(".js"));
for (let file of events) {
let event = require(`./events/${file}`)
let eve = new event(bot , file.split(".js").join(""))
}

bot.shards.filter(d => d).forEach(shard =>{shard.editStatus("online" , {name: status.split("[SHARD]").join(shard.id.toString()), type: bot.config.BOT_STATUS.type || null , url: bot.config.BOT_STATUS.url || null})})

bot.lang = {}

const translate = fs.readdirSync(`./translate/`).filter(file => file.endsWith(".js"));
for (let tran of translate) {
let file = require(`./translate/${tran}`)
bot.lang[tran.split(".js").join("")] = file
}

require("./musicPlugin/index")(bot)

}