const soundcloudID = process.env.soundcloud

const conSetup = require("../utils/connection.js")

const yts = require( 'yt-search' )

const scdl = require("soundcloud-downloader").default

const ytdl = require("ytdl-core")

      function formatTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;
}

module.exports.run = async(message , args , bot , lang , data) =>{

if(!message.member.voiceState || !message.member.voiceState.channelID) return bot.createMessage( message.channel.id , lang.music.music_join )

let voiceID = message.member.voiceState.channelID

let con = bot.voiceConnections.find(d => d.id == message.guildID)

if(!con){

con = await bot.joinVoiceChannel(voiceID).catch(err => err)
if(!con) return bot.createMessage( message.channel.id , lang.lang.music_noprem ) 
conSetup(con , data)
      con.now = null
			con.songs= []
			con.volume= data.vol
      con.author= message.author.id
      con.repeating= data.repeat
      con.voteSkip = []
      con.skip = false
			con.textChannel = message.channel
			con.voiceChannel= voiceID
}

let channel = bot.guilds.get(message.guildID).channels.get(con.channelID)



if(channel.id !== voiceID) return bot.createMessage( message.channel.id , lang.music.music_nochannel.replace("${channel.name}" , channel.name) ) 


if(con.now && con.paused && args.length < 1) {

con.resume()

return bot.createMessage( message.channel.id , `▶️ **${con.now.title}**` ) 
}

if(args.length < 1) return bot.createMessage(message.channel.id , `> 🎵 **PlayCommand**

** ${message.prefix}play [Youtube Query]
  ${message.prefix}play [Youtube URL]
  ${message.prefix}play [Soundcloud URL]**`)


if(!con.now){


let soundcloud = false

if(message.embeds.length > 0){
let embed = message.embeds[0]
if(embed.type == "video" && embed.provider && embed.provider.name == "SoundCloud"){
soundcloud = embed
}}


let msg = await bot.createMessage(message.channel.id , `${soundcloud ? lang.music.soundcloud : lang.music.youtube} - **${args.join(" ")}**`)


if(soundcloud){

let info = await scdl.getInfo(soundcloud.url, soundcloudID).catch(err =>{})

if(!info) return bot.createMessage(message.channel.id , `${soundcloud ? lang.music.soundcloud : lang.music.youtube} - ${bot.lang.soundcloud_track}`)

con.now = Object.assign({Mtype:"soundcloud" , Mauthor:message.author.id} , info)

let stream = await scdl.download(soundcloud.url, soundcloudID).catch(err =>{})
     await con.play(stream, {voiceDataTimeout:5000 , inlineVolume: true})
 msg.edit(`⚙️ **Playing**\${soundcloud ? lang.music.soundcloud : lang.music.youtube} **${soundcloud.title}** \n:watch: **[${formatTime(info.full_duration)}]** \n:singer: **${info.user.username}**`)

}else{

const result = await yts(args.join(" "))

if(!result || result.videos.length < 1) return msg.edit(bot.music_noresult.replace("${query}" , args.join(" ")))   

let video = result.videos[0]

con.now = Object.assign({Mtype:"youtube" , Mauthor:message.author.id} , video)

await con.play(ytdl(video.url), {voiceDataTimeout:5000 , inlineVolume: true})

 msg.edit(`⚙️ **Playing**\n${soundcloud ? lang.music.soundcloud : lang.music.youtube} **${video.title}** \n:watch: **[${video.timestamp}]** \n:singer: **${video.author.name}**`)

}


}else{





let soundcloud = false

if(message.embeds.length > 0){
let embed = message.embeds[0]
if(embed.type == "video" && embed.provider && embed.provider.name == "SoundCloud"){
soundcloud = embed
}}


let msg = await bot.createMessage(message.channel.id , `${soundcloud ? lang.music.soundcloud : lang.music.youtube} - **${args.join(" ")}**`)


if(soundcloud){

let info = await scdl.getInfo(soundcloud.url, soundcloudID).catch(err =>{})

if(!info) return bot.createMessage(message.channel.id , `${soundcloud ? lang.music.soundcloud : lang.music.youtube} - ${bot.lang.soundcolud_track}`)

con.songs.push(Object.assign({Mtype:"soundcloud" , Mauthor:message.author.id} , info))

 msg.edit(`⚙️ **Added to the queue**\n${soundcloud ? lang.music.soundcloud : lang.music.youtube} **${soundcloud.title}** \n:watch: **[${formatTime(info.full_duration)}]** \n:singer: **${info.user.username}**`)

}else{

const result = await yts(args.join(" "))

if(!result || result.videos.length < 1) return msg.edit(lang.music.music_noresult.replace("${query}" , args.join(" ")))   

let video = result.videos[0]

con.songs.push(Object.assign({Mtype:"youtube" , Mauthor:message.author.id} , video))

 msg.edit(`⚙️ **Added to the queue**\n${soundcloud ? lang.music.soundcloud : lang.music.youtube}**${video.title}** \n:watch: **[${video.timestamp}]** \n:singer: **${video.author.name}**`)

}









}

}

module.exports.name = "play"
module.exports.aliases = ["p"]
module.exports.des = "play a song from youtube or soundcloud"
module.exports.cooldown = 1
module.exports.admin = false