
module.exports.run = async(message , args , bot , lang , data) =>{


if(!message.member.voiceState)  return bot.createMessage( message.channel.id , lang.music.music_join  )
if(!message.member.voiceState || !message.member.voiceState.channelID)  return bot.createMessage( message.channel.id , lang.music.music_join  )

let voiceID = message.member.voiceState.channelID

let con = bot.voiceConnections.find(d => d.id == message.guildID)

if(!con) return bot.createMessage( message.channel.id , lang.music.music_nomusic )

let channel = bot.guilds.get(message.guildID).channels.get(con.channelID)


if(channel.id !== voiceID) return bot.createMessage( message.channel.id , lang.music.music_nochannel.replace("${channel.name}" , channel.name) ) 

if(!con.now || !con.playing) return bot.createMessage( message.channel.id , lang.music.music_nomusic )  

con.pause()

return bot.createMessage( message.channel.id , `⏸️ **${con.now.title}**
**To resume use:** ${message.prefix}play` ) 

}

module.exports.name = "pause"
module.exports.aliases = []
module.exports.des = "pause the current song"
module.exports.cooldown = 1
module.exports.admin = false