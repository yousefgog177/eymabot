const soundcloudID = process.env.soundcloud

const yts = require( 'yt-search' )

const scdl = require("soundcloud-downloader").default

const ytdl = require("ytdl-core")

const converter = require('number-to-words');



module.exports.run = async(message , args , bot , lang , data) =>{


if(!message.member.voiceState)  return bot.createMessage( message.channel.id , lang.music.music_join  )
if(!message.member.voiceState || !message.member.voiceState.channelID)  return bot.createMessage( message.channel.id ,  lang.music.music_join  )

let voiceID = message.member.voiceState.channelID

let con = bot.voiceConnections.find(d => d.id == message.guildID)

if(!con) return bot.createMessage( message.channel.id ,  lang.music.music_nomusic )

let channel = bot.guilds.get(message.guildID).channels.get(con.channelID)


if(channel.id !== voiceID) return bot.createMessage( message.channel.id ,  lang.music.music_nochannel.replace("${channel.name}" , channel.name) ) 

if(!con.now || !con.playing) return bot.createMessage( message.channel.id ,  lang.music.music_nomusic )  

 let embed = {
      "color": 16711680,
      "fields": [],
      "footer": {
        "text": message.author.username,
        "icon_url": message.author.avatarURL
      }
    }

let page = args[0] ? Number(args[0] - 1) ? Number(args[0] - 1) : 0 : 0


let musicType = con.now ? con.now.Mtype : null

if(!musicType){
embed.title = "No thing playing!"
embed.description = "Now: \u23F9 "+bar(-1)+" "+volumeIcon(!con?100:con.volume)
}else{
embed.title = musicType == "soundcloud" ?  lang.music.soundcloud + " " + con.now.title :  lang.music.youtube + " " + con.now.title
embed.description = `Now: ` + embedFormat(con)

}

let songs = con.songs ? con.songs : []

let songPerPage = 10

let i = page * songPerPage

let songs1 = songs.slice(i, i + songPerPage)

if(songs1.length < 1 && page !== 0) { embed.description = embed.description + "\n" +  bot.lang.queue_pagenotfound}

embed.footer = {text:`Page: ${songs1.length > 0 ? page + 1 : "None"}/${Math.round(songs.length / songPerPage)}`}

songs1.forEach(d =>{
i++
let type = d.Mtype == "soundcloud" ? bot.lang.soundcloud : bot.lang.youtube

        let num;
        if((i) > 8) {
          let st = `${i}`
          let n1 = converter.toWords(st[0])
          let n2 = converter.toWords(st[1])
          num = `:${n1}::${n2}:`
        } else {
        let n = converter.toWords(i)
        num = `:${n}:`
      }

embed.fields.push({name: `${num} ${type}` , value: `**${d.title}** <@${d.Mauthor}>`})
})
  
bot.createMessage(message.channel.id , {embed:embed})


}

module.exports.name = "queue"
module.exports.aliases = ["list"]
module.exports.des = "get a list of music that playing!"
module.exports.cooldown = 1
module.exports.admin = false



      function bar(precent) {

        var str = '';

        for (var i = 0; i < 12; i++) {

          let pre = precent
          let res = pre * 12;

          res = parseInt(res)

          if(i == res){
            str+="\uD83D\uDD18";
          }
          else {
            str+="▬";
          }
        }

        return str;

      }

      function volumeIcon(volume) {

    volume = volume * 100

        if(volume == 0) return "\uD83D\uDD07";
       if(volume < 30) return "\uD83D\uDD08";
       if(volume < 70) return "\uD83D\uDD09";

       return "\uD83D\uDD0A";

      }

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

      function embedFormat(queue) {

        if(!queue || !queue.now) {
          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(100);
        } else if(!queue.playing) {
          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(queue.volume);
        } else { 
          let progress = (Number(queue.current.playTime) / Number(typeof queue.now.duration !== "object" ? queue.now.duration : queue.now.seconds * 1000));     

  let prog = bar(progress);
          let volIcon = volumeIcon(queue.volume);
          let playIcon = (queue.paused ? "\u23F8" : "\u25B6")
          let dura = formatTime(Number(typeof queue.now.duration !== "object" ? queue.now.duration : queue.now.seconds * 1000));


          return playIcon + ' ' + prog + ' `[' + formatTime(Number(queue.current.playTime)) + '/' + dura + ']`' + volIcon;


        }

      }


