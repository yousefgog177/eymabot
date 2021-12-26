const Eris = require("eris")
const config = require("../config.js")
module.exports = class {

constructor(bot , name) {
this.ocooldown = {}
this.cooldowns = 120 * 1000

this.bot = bot
this.bot.on(name , (message) => this.run(message))
}

async run(message) {

    let data = await this.bot.guildSettings.findOne({id: message.guildID}) || await new this.bot.guildSettings({ id: message.guildID }).save()

let prefix = data.prefix || config.PREFIX


if(!message.content.startsWith(prefix)) {
if(message.mentions.filter(d => d.id == this.bot.user.id).length > 0 || message.content.includes("prefix")) {
if(this.ocooldown[message.author.id] && this.ocooldown[message.author.id] > Date.now()) return;
if(!this.ocooldown[message.author.id]) {this.ocooldown[message.author.id] = Date.now() + this.cooldowns}
this.bot.createMessage(message.channel.id , this.bot.lang[data.lang].bot.default.mention.replace("[PREFIX]" , data.prefix))
}
return;
}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = this.bot.commands.find(cmd => cmd.name == commandName || (cmd.aliases && cmd.aliases.includes(commandName)));

	if (!command) return;

if(command.ADMINS && !config.ADMINS.includes(message.author.id)) return;
if(!config.ADMINS.includes(message.author.id)){
    
	let cooldownAmount = (command.cooldown || 0) * 1000;

    if(!this.bot.cooldowns[message.guildID]) { this.bot.cooldowns[message.guildID] = {} }
    if(!this.bot.cooldowns[message.guildID][command.name]) { this.bot.cooldowns[message.guildID][command.name] = {} }
    if(!this.bot.cooldowns[message.guildID][command.name][message.author.id] || this.bot.cooldowns[message.guildID][command.name][message.author.id] < Date.now()){
        this.bot.cooldowns[message.guildID][command.name][message.author.id] = Date.now() + cooldownAmount
    }else{
        const timeLeft = (this.bot.cooldowns[message.guildID][command.name][message.author.id] - Date.now()) / 1000; 
        return this.bot.createMessage(message.channel.id , this.bot.lang[data.lang].bot.cooldown.split("{{ms}}").join(timeLeft.toFixed(1)));
    }

}


message.guild = this.bot.guilds.get(message.guildID)

    /*this.bot.commandsLog.send("" , {embeds:[{
		"title": "Command Request!",
		"description": `**> Author <@${message.author.id}> ${message.author.username} (${message.author.id})**\n\`\`\`${message.content}\`\`\`\n> **Guild: ${message.guild.name || "NONE"} (${message.guild.id})**\n> **Channel: <#${message.channel.id}> ${message.channel.name} (${message.channel.id})**`,
		"color": 12844803
	  }
	]})*/
	try {
    message.prefix = prefix

		command.run(message , args , this.bot , this.bot.lang[data.lang || "ar-SA"] ? this.bot.lang[data.lang || "ar-SA"].bot : this.bot.lang[data.lang || "ar-SA"].bot , data);
	} catch (error) {
		console.log(error.message);
	}


}}